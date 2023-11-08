import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, compareSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { envConfig } from '../../../config';
import { generateCode } from '../../../helpers/code.helper';
import { checkRequirements } from '../../../helpers/password.helpers';
import { MailService } from '../../../mail/mail.service';
import { UserEntity } from '../../auth-user/entities/user.entity';
import { DeleteDto } from '../../dto/delete.dto';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { InvitationDto } from '../../dto/invitation.dto';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { SetPasswordDto } from '../../dto/set-password.dto';
import { extractJwt } from '../auth.helpers';
import {
  IAuthService,
  IGenerateModule,
} from '../interfaces/generate-module.interface';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IUser } from '../../../types/user.interface';
import { IDevice } from '../../../types/device.interface';

export function authServiceFactory(data: IGenerateModule) {
  @Injectable()
  class AuthService implements IAuthService {
    constructor(
      @InjectRepository(data.UserEntity, data?.userDatabase)
      private readonly userRepo: Repository<IUser>,
      @InjectRepository(data.DeviceEntity, data?.userDatabase)
      private readonly deviceRepo: Repository<IDevice>,
      @InjectRepository(data.InvitationEntity, data?.userDatabase)
      private readonly invitationRepo: Repository<any>,
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

    validate(token: string) {
      return this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.device', 'device')
        .where('device.token = :token', { token })
        .getOne();
    }

    async invite(body: InvitationDto) {
      const code = generateCode(7);
      await this.invitationRepo
        .createQueryBuilder()
        .insert()
        .values({
          email: body.email,
          code,
        })
        .orUpdate(['code'], ['email'])
        .execute();

      this.mailService.sendMail(
        body.email,
        'Validate Email',
        'Invitation code: ' + code,
      );
    }

    async register(body: RegisterDto) {
      const invitation = await this.invitationRepo.findOne({
        where: { code: body.invitation_code },
      });
      if (!invitation) throw new UnprocessableEntityException('No invitation');

      checkRequirements(body.password);
      const user = await this.userRepo.create(body).save();

      return user;
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

    async login(body: LoginDto) {
      const found = await this.userRepo.findOne({
        select: ['password'],
        where: { email: body.email },
      });
      if (!found) throw new UnauthorizedException('No user by that email.');
      if (await compare(body.password, found.password)) {
        return await this.userRepo.findOne({
          where: { email: body.email },
        });
      } else {
        throw new UnauthorizedException('Wrong password.');
      }
    }

    async delete(user: UserEntity, body: DeleteDto) {
      if (await compare(body.password, user.password)) {
        await user.remove();
        return user;
      }
      throw new UnauthorizedException('Wrong password.');
    }

    async forgotPassword(body: ForgotPasswordDto) {
      const user = await this.userRepo.findOne({
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
      const user = await this.userRepo.findOne({
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
  }

  data.AuthService = AuthService;
}
