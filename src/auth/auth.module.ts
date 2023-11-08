import { Module } from '@nestjs/common';
import { AuthModule } from './auth-user/auth.module';
import { AdminAuthModule } from './auth-admin/auth-admin.module';

@Module({
  imports: [AuthModule, AdminAuthModule],
})
export class AuthModule {}
