import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, compareSync, hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { EmailValidationEntity } from '../entities/email-validation.entity';
import { UserAvatarEntity } from '../entities/user-avatar.entity';
import { UserDataEntity } from '../entities/user-data.entity';
import { generateCode } from '../helpers/code.helper';
import { checkRequirements } from '../helpers/password.helpers';
import { MailService } from '../mail/mail.service';
import { DeleteDto } from './dto/delete.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { keyBy } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserDataEntity)
    private readonly userDataRepo: Repository<UserDataEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(UserAvatarEntity)
    private readonly userAvatarRepo: Repository<UserAvatarEntity>,
    @InjectRepository(EmailValidationEntity)
    private readonly validateEmailRepo: Repository<EmailValidationEntity>,
  ) {}

  async addTestUsers(users: RegisterDto[]) {
    const avatars = await this.userAvatarRepo.save(
      users.map((user) =>
        this.userAvatarRepo.create({ username: user.username }),
      ),
    );
    const avatarsKeyByUsername = keyBy(avatars, (el) => el.username);
    await this.userDataRepo.save(
      users.map((user) =>
        this.userDataRepo.create({
          id: avatarsKeyByUsername[user.username]?.id,
          email: user.email,
          password: user.password,
          email_validated: true,
        }),
      ),
    );
  }

  validate(email: string) {
    return this.userDataRepo.findOne({
      where: {
        email,
      },
    });
  }

  async register(body: RegisterDto) {
    checkRequirements(body.password);
    const { username } = body;
    const avatar = await this.userAvatarRepo.create({ username }).save();
    const ve = await this.validateEmailRepo
      .create({ email: body.email, code: generateCode(7) })
      .save();

    this.mailService.sendMail(
      body.email,
      'Validate Email',
      'Validateion code: ' + ve.code,
    );
    return this.userDataRepo.create({ id: avatar.id, ...body }).save();
  }

  makeJwtToken(user: UserDataEntity, res: Response) {
    res.cookie('Authorization', this.jwtService.sign({ email: user.email }));
  }

  removeJwtToken(res: Response) {
    res.clearCookie('Authorization');
  }

  decodeJwtToken(str: string) {
    return this.jwtService.decode(str);
  }

  async login(body: LoginDto) {
    const found = await this.userDataRepo.findOne({
      select: ['password'],
      where: { email: body.email },
    });
    if (!found) throw new UnauthorizedException('No user by that email.');
    if (await compare(body.password, found.password)) {
      return await this.userDataRepo.findOne({
        where: { email: body.email },
      });
    } else {
      throw new UnauthorizedException('Wrong password.');
    }
  }

  async delete(user: UserDataEntity, body: DeleteDto) {
    if (await compare(body.password, user.password)) {
      await user.remove();
      return user;
    }
    throw new UnauthorizedException('Wrong password.');
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.userDataRepo.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('No user with this email.');
    }
    user.set_password_code = randomBytes(20).toString('hex');
    await user.save();
    this.mailService.sendMail(
      user.email,
      'Forgot email.',
      'Go to link in order to restart password: ' +
        process.env.FORGOT_PASSWORD_LINK,
    );
  }

  async resetPassword(user: UserDataEntity, body: ResetPasswordDto) {
    if (compareSync(body.oldPassword, user.password)) {
      user.password = body.newPassword;
      await user.save();
    }
    throw new UnprocessableEntityException('Old password does not match.');
  }

  async setPassword(setPasswordHash: string, body: SetPasswordDto) {
    const user = await this.userDataRepo.findOne({
      where: {
        set_password_code: setPasswordHash,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('No user owns that hash.');
    }
    user.set_password_code = null;
    user.password = body.newPassword;
    await user.save();
  }

  async validateEmail(code: string) {
    const ev = await this.validateEmailRepo.findOne({ where: { code } });
    if (!ev) return;
    const user = await this.userDataRepo.findOne({
      select: ['id'],
      where: { email: ev.email },
    });
    if (!user) return;
    user.email_validated = true;
    await user.save();
    await ev.remove();
  }
}
