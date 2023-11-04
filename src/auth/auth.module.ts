import { Module } from '@nestjs/common';
import { AuthUserModule } from './auth-user/auth-user.module';
import { AdminAuthModule } from './auth-admin/auth-admin.module';

@Module({
  imports: [AuthUserModule, AdminAuthModule],
})
export class AuthModule {}
