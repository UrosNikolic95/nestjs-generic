import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envConfig } from '../../config';
import { AdminDeviceEntity } from '../../entities/admin-device.entity';
import { AdminEntity } from '../../entities/admin.entity';
import { DeviceEntity } from '../../entities/device.entity';
import { UserEntity } from '../../entities/user.entity';
import { MailModule } from '../../mail/mail.module';
import { UserSubscriber } from '../../subscribers/user.subscriber';
import { userDatabase } from '../auth.const';
import { JwtGuard } from '../guards/jwt.guard';
import { LocalGuard } from '../guards/local.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';

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
    LocalStrategy,
    LocalGuard,
    JwtStrategy,
    JwtGuard,
    UserSubscriber,
  ],
  exports: [AuthUserService],
})
export class AuthUserModule {}
