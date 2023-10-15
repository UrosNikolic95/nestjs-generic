import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthUserService } from '../auth-user.service';
import { localLabel } from '../../auth.const';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, localLabel) {
  constructor(private authService: AuthUserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    return await this.authService.validateLocal({ email, password });
  }
}
