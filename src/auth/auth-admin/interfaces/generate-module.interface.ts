import { Type } from '@nestjs/common';

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
  AuthService: Type;
  JwtStrategy: Type;
  LocalStrategy: Type;
  AdminSubscriber: Type;
  AuthController: Type;
  AuthAdminModule: Type;
}
