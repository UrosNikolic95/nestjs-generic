import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataEntity } from '../entities/user-data.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSubscriber } from '../subscribers/user.subscriber';
import { JwtGuard } from './guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalGuard } from './guards/local.guard';
import { MailModule } from '../mail/mail.module';
import { UserAvatarEntity } from '../entities/user-avatar.entity';
import { EmailValidationEntity } from '../entities/email-validation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserDataEntity,
      UserAvatarEntity,
      EmailValidationEntity,
    ]),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
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
})
export class AuthModule {}
