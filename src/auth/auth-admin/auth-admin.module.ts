import { authFactory } from './factories/auth.factory';

const adminData = authFactory('admin');

export class AuthAdminModule extends adminData.AuthModule {}
