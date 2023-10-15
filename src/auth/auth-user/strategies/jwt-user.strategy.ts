import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from '../../../config';
import { jwtLabel } from '../../auth.const';
import { AuthUserService } from '../auth-user.service';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, jwtLabel) {
  constructor(private readonly authService: AuthUserService) {
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
    return await this.authService.validateJwt(payload.token);
  }
}
