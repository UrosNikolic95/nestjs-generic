import { Module } from '@nestjs/common';
import { IGenerateModule } from '../interfaces/generate-module.interface';
import { authControllerFactory } from './auth-controller.factory';
import { authEntityFactory } from './auth-entity.factory';
import { authGuardFactory } from './auth-guard.factory';
import { authStrategyFactory } from './auth-strategy.factory';
import { authSubscriberFactory } from './auth-subscriber.factory';
import { authServiceFactory } from './auth.service.facotry';
import { PhoneModule } from '../../../phone/phone.module';
import { MailModule } from '../../../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userDatabase } from '../../auth.const';
import { envConfig } from '../../../config';

export function authModuleFactory(name: string) {
  const data = {
    name,
    jwtLabel: `${name}-jwt`,
    localLabel: `${name}-local`,
  } as IGenerateModule;
  authEntityFactory(data);
  authServiceFactory(data);
  authSubscriberFactory(data);
  authStrategyFactory(data);
  authGuardFactory(data);
  authControllerFactory(data);
  @Module({
    imports: [
      TypeOrmModule.forFeature(
        [data.UserEntity, data.DeviceEntity, data.InvitationEntity],
        userDatabase,
      ),
      PassportModule.register({ session: true }),
      JwtModule.register({
        secret: envConfig.JWT_SECRET,
        signOptions: { expiresIn: envConfig.JWT_EXPIRES },
      }),
      MailModule,
      PhoneModule,
    ],
    controllers: [data.AuthController],
    providers: [
      data.AuthService,
      data.LocalStrategy,
      data.LocalGuard,
      data.JwtGuard,
      data.JwtStrategy,
      data.AdminSubscriber,
    ],
  })
  class AuthAdminModule {}

  data.AuthAdminModule = AuthAdminModule;

  return data;
}
