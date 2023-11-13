import { authFactory } from './factories/auth.factory';

const adminData = authFactory({ name: 'admin' });

export class AdminAuthModule extends adminData.AuthModule {}

export const AdminLocalAuth = adminData.LocalAuth;
export const AdminJwtAuth = adminData.JwtAuth;
