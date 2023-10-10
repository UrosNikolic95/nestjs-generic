import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { envConfig } from '../../config';
import { jwtLabel } from '../auth.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, jwtLabel) {
  constructor(private readonly authService: AuthService) {
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
