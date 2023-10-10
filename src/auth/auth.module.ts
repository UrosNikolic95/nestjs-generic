import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSubscriber } from '../subscribers/user.subscriber';
import { JwtGuard } from './guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalGuard } from './guards/local.guard';
import { MailModule } from '../mail/mail.module';
import { envConfig } from '../config';
import { userDatabase } from './auth.const';
import { DeviceEntity } from '../entities/device.entity';
import { AdminEntity } from '../entities/admin.entity';
import { AdminDeviceEntity } from '../entities/admin-device.entity';

export function AuthModule() {
  @Module({
    imports: [
      TypeOrmModule.forFeature(
        [UserEntity, DeviceEntity, AdminEntity, AdminDeviceEntity],
        userDatabase,
      ),
      PassportModule.register({ session: true }),
      JwtModule.register({
        secret: envConfig.JWT_SECRET,
        signOptions: { expiresIn: envConfig.JWT_EXPIRES },
      }),
      MailModule,
    ],
    controllers: [AuthController],
    providers: [
      AuthService,
      LocalStrategy,
      LocalGuard,
      JwtStrategy,
      JwtGuard,
      UserSubscriber,
    ],
    exports: [AuthService],
  })
  class AuthModule {}
  return AuthModule;
}
