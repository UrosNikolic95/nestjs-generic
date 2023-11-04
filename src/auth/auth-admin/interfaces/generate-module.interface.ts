import { Type } from '@nestjs/common';
import { RegisterDto } from '../../dto/register.dto';
import { IUser } from '../../../types/user.interface';
import { InvitationDto } from '../../dto/invitation.dto';
import { Response, Request } from 'express';
import { LoginDto } from '../../dto/login.dto';
import { SetPasswordDto } from '../../dto/set-password.dto';
import { UserEntity } from '../../auth-user/entities/user.entity';
import { DeleteDto } from '../../dto/delete.dto';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { ResetPasswordDto } from '../../dto/reset-password.dto';

export interface IGenerateModule {
  name: string;
  jwtLabel: string;
  localLabel: string;
  DeviceEntity: Type;
  InvitationEntity: Type;
  UserEntity: Type;
  JwtGuard: Type;
  JwtAuth: () => MethodDecorator & ClassDecorator;
  LocalGuard: Type;
  LocalAuth: () => MethodDecorator & ClassDecorator;
  AuthService: Type<IAuthService>;
  JwtStrategy: Type;
  LocalStrategy: Type;
  AdminSubscriber: Type;
  AuthController: Type;
  AuthModule: Type;
}

export interface IAuthService {
  addTestUsers(users: RegisterDto[]): Promise<void>;
  validate(token: string): Promise<IUser>;
  invite(body: InvitationDto): Promise<void>;
  register(body: RegisterDto): Promise<IUser>;
  makeJwtToken(user: IUser, res: Response): Promise<void>;
  removeJwtToken(res: Response, req: Request): Promise<void>;
  decodeJwtToken(str: string):
    | string
    | {
        [key: string]: any;
      };
  login(body: LoginDto): Promise<IUser>;
  delete(user: UserEntity, body: DeleteDto): Promise<IUser>;
  forgotPassword(body: ForgotPasswordDto): Promise<void>;
  resetPassword(user: IUser, body: ResetPasswordDto): Promise<void>;
  setPassword(setPasswordHash: string, body: SetPasswordDto): Promise<void>;
}
