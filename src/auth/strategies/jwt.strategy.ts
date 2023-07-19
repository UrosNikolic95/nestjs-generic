import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { envConfig } from '../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies['Authorization'];
        return token?.replace('Bearer', '')?.trim();
      },
      ignoreExpiration: true,
      secretOrKey: envConfig.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return await this.authService.validate(payload.email);
  }
}
