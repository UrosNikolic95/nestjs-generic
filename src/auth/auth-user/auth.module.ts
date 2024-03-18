import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envConfig } from '../../config';
import { DeviceEntity } from './entities/device.entity';
import { UserEntity } from './entities/user.entity';
import { MailModule } from '../../mail/mail.module';
import { UserSubscriber } from './user.subscriber';
import { LocalGuard } from './guards/local.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PhoneModule } from '../../phone/phone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [UserEntity, DeviceEntity],
      envConfig.USER_DB_NAME,
    ),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: envConfig.JWT_EXPIRES },
    }),
    MailModule,
    PhoneModule,
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
export class AuthModule {}
