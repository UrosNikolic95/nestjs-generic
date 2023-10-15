import { Module } from '@nestjs/common';
import { AuthUserModule } from './auth-user/auth.module';
import { AuthAdminModule } from './auth-admin/auth-admin.module';

@Module({
  imports: [AuthUserModule, AuthAdminModule],
})
export class AuthModule {}
