import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, compareSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Response, Request } from 'express';
import { Repository } from 'typeorm';
import { envConfig } from '../../config';
import { DeviceEntity } from './entities/device.entity';
import { UserEntity } from './entities/user.entity';
import { generateCode } from '../../helpers/code.helper';
import { checkRequirements } from '../../helpers/password.helpers';
import { MailService } from '../../mail/mail.service';
import { userDatabase } from '../auth.const';
import { DeleteDto } from '../dto/delete.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { SetPasswordDto } from '../dto/set-password.dto';
import { extractJwt } from '../auth.helpers';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(UserEntity, userDatabase)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(DeviceEntity, userDatabase)
    private readonly deviceRepo: Repository<DeviceEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async addTestUsers(users: RegisterDto[]) {
    await this.userRepo
      .createQueryBuilder()
      .insert()
      .values(
        users.map(
          (user) =>
            ({
              email: user.email,
              username: user.username,
              password: user.password,
              email_validated: true,
            } as Partial<UserEntity>),
        ),
      )
      .orIgnore()
      .execute();
  }

  validateJwt(token: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.device', 'device')
      .where('device.token = :token', { token })
      .getOne();
  }

  async register(body: RegisterUserDto) {
    try {
      checkRequirements(body.password);
      const user = await this.userRepo
        .create({ ...body, email_validation_code: generateCode(7) })
        .save();

      this.mailService.sendMail(
        body.email,
        'Validate Email',
        'Validateion code: ' + user.email_validation_code,
      );
      return user;
    } catch (err) {
      throw new UnprocessableEntityException(err?.detail || err?.message);
    }
  }

  async makeJwtToken(user: UserEntity, res: Response) {
    const token = randomBytes(21).toString('hex');
    await this.deviceRepo
      .create({
        user_id: user.id,
        token,
      })
      .save();

    res.cookie('Authorization', this.jwtService.sign({ token }));
  }

  async removeJwtToken(res: Response, req: Request) {
    const data = this.jwtService.decode(extractJwt(req));
    await this.deviceRepo.delete({
      token: data?.['token'],
    });
    res.clearCookie('Authorization');
  }

  decodeJwtToken(str: string) {
    return this.jwtService.decode(str);
  }

  async validateLocal(body: LoginDto) {
    const found = await this.userRepo.findOne({
      select: ['password'],
      where: { email: body.email },
    });
    if (!found) throw new UnauthorizedException('No user by that email.');
    if (compareSync(body.password, found.password)) {
      return await this.userRepo.findOne({
        where: { email: body.email },
      });
    } else {
      throw new UnauthorizedException('Wrong password.');
    }
  }

  async delete(user: UserEntity, body: DeleteDto) {
    const userWithPassword = await this.userRepo.findOne({
      select: ['id', 'password'],
      where: { id: user.id },
    });
    if (compareSync(body.password, userWithPassword.password)) {
      await userWithPassword.remove();
    }
    throw new UnauthorizedException('Wrong password.');
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user)
      throw new UnprocessableEntityException('No user with this email.');

    user.set_password_code = randomBytes(20).toString('hex');
    await user.save();
    this.mailService.sendMail(
      user.email,
      'Forgot email.',
      'Go to link in order to restart password: ' +
        envConfig.FORGOT_PASSWORD_LINK +
        user.set_password_code,
    );
  }

  async resetPassword(user: UserEntity, body: ResetPasswordDto) {
    if (compareSync(body.oldPassword, user.password)) {
      user.password = body.newPassword;
      await user.save();
    }
    throw new UnprocessableEntityException('Old password does not match.');
  }

  async setPassword(setPasswordHash: string, body: SetPasswordDto) {
    checkRequirements(body.newPassword);
    const user = await this.userRepo.findOne({
      where: {
        set_password_code: setPasswordHash,
      },
    });
    if (!user)
      throw new UnprocessableEntityException('No user owns that hash.');

    user.set_password_code = null;
    user.password = body.newPassword;
    await user.save();
  }

  async validateEmail(code: string) {
    const user = await this.userRepo.findOne({
      select: ['id'],
      where: { email_validation_code: code },
    });
    if (!user)
      throw new UnprocessableEntityException('No user owns that code.');
    user.email_validated = true;
    user.email_validation_code = null;
    await user.save();
  }

  async validatePhone(code: string) {
    const user = await this.userRepo.findOne({
      select: ['id'],
      where: { phone_validation_code: code },
    });
    if (!user)
      throw new UnprocessableEntityException('No user owns that code.');
    user.phone_validated = true;
    user.phone_validation_code = null;
    await user.save();
  }
}
