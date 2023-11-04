import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { envConfig } from '../../../config';
import { AuthAdminService } from '../auth-admin.service';
import { IGenerateModule } from '../interfaces/generate-module.interface';
import { Strategy as LocalPassportStrategy } from 'passport-local';
import { Request } from 'express';

export function authStrategyFactory(data: IGenerateModule) {
  @Injectable()
  class JwtPassportStrategy extends PassportStrategy(
    JwtStrategy,
    data.jwtLabel,
  ) {
    constructor(
      @Inject(data.AuthService)
      private readonly authService: AuthAdminService,
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req: Request) => {
            const token = req.cookies['Authorization'];
            return token?.replace('Bearer', '')?.trim();
          },
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        ignoreExpiration: true,
        secretOrKey: envConfig.JWT_SECRET,
      });
    }

    async validate(payload: any) {
      return await this.authService.validate(payload.token);
    }
  }

  data.JwtStrategy = JwtPassportStrategy;

  @Injectable()
  class LocalStrategy extends PassportStrategy(
    LocalPassportStrategy,
    data.localLabel,
  ) {
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

  data.LocalStrategy = LocalStrategy;
}
