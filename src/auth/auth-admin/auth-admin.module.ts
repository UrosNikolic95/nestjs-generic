import { authModuleFactory } from './factories/auth-module.factory';

const adminData = authModuleFactory('admin');

export class AuthAdminModule extends adminData.AuthModule {}
