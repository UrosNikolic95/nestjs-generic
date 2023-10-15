import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envConfig } from '../../config';
import { DeviceEntity } from './entities/device.entity';
import { UserEntity } from './entities/user.entity';
import { MailModule } from '../../mail/mail.module';
import { UserSubscriber } from '../../subscribers/user.subscriber';
import { userDatabase } from '../auth.const';
import { LocalUserGuard } from './guards/local.guard';
import { LocalUserStrategy } from './strategies/user-local.strategy';
import { JwtUserGuard } from './guards/jwt.guard';
import { JwtUserStrategy } from './strategies/user-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DeviceEntity], userDatabase),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: envConfig.JWT_EXPIRES },
    }),
    MailModule,
  ],
  controllers: [AuthUserController],
  providers: [
    AuthUserService,
    LocalUserStrategy,
    LocalUserGuard,
    JwtUserStrategy,
    JwtUserGuard,
    UserSubscriber,
  ],
  exports: [AuthUserService],
})
export class AuthUserModule {}
