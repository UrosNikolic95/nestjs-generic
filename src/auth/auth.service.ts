import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, compareSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { checkRequirements } from '../helpers/password.helpers';
import { MailService } from '../mail/mail.service';
import { DeleteDto } from './dto/delete.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetPasswordDto } from './dto/set-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  validate(email: string) {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  register(body: RegisterDto) {
    checkRequirements(body.password);
    return this.userRepo.create(body).save();
  }

  makeJwtToken(user: any, res: Response) {
    res.cookie('Authorization', this.jwtService.sign({ email: user.email }));
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

  async delete(req: Request, body: DeleteDto) {
    if (await compare(body.password, req.user['password'])) {
      const user = req.user;
      await user.remove();
      return req.user;
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
    user.setPasswordHash = randomBytes(20).toString('hex');
    await user.save();
    this.mailService.sendMail(
      user.email,
      'Forgot email.',
      'Go to link in order to restart password: ' +
        process.env.FORGOT_PASSWORD_LINK,
    );
  }

  async resetPassword(req: Request, body: ResetPasswordDto) {
    if (compareSync(body.oldPassword, req.user.password)) {
      req.user.password = body.newPassword;
      await req.user.save();
    }
    throw new UnprocessableEntityException('Old password does not match.');
  }

  async setPassword(setPasswordHash: string, body: SetPasswordDto) {
    const user = await this.userRepo.findOne({
      where: {
        setPasswordHash,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('No user owns that hash.');
    }
    user.setPasswordHash = null;
    user.password = body.newPassword;
    await user.save();
  }
}
