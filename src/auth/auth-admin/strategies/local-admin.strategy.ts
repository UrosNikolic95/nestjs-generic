import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { localLabel } from '../../auth.const';
import { AuthAdminService } from '../auth-admin.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, localLabel) {
  constructor(private authService: AuthAdminService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    return await this.authService.login({ email, password });
  }
}
