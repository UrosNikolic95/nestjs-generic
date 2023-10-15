import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthAdminService } from '../auth-admin.service';
import { envConfig } from '../../../config';
import { jwtAdminLabel } from '../../auth.const';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  jwtAdminLabel,
) {
  constructor(private readonly authService: AuthAdminService) {
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
