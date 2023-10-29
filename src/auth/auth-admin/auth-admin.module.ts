import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envConfig } from '../../config';
import { AdminDeviceEntity } from './entities/admin-device.entity';
import { AdminEntity } from './entities/admin.entity';
import { MailModule } from '../../mail/mail.module';
import { userDatabase } from '../auth.const';
import { LocalAdminGuard } from './guards/local-admin.guard';
import { LocalAdminStrategy } from './strategies/local-admin.strategy';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { AdminInvitationEntity } from './entities/admin-invitation.entity';
import { AdminSubscriber } from './auth-admin.subscriber';
import { PhoneModule } from '../../phone/phone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [AdminEntity, AdminDeviceEntity, AdminInvitationEntity],
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
  controllers: [AuthAdminController],
  providers: [
    AuthAdminService,
    LocalAdminGuard,
    LocalAdminStrategy,
    JwtAdminGuard,
    JwtAdminStrategy,
    AdminSubscriber,
  ],
  exports: [AuthAdminService],
})
export class AuthAdminModule {}
