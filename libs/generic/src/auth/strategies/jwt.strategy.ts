import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../../consts/consts';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies['Authorization'];
        return token?.replace('Bearer', '')?.trim();
      },
      ignoreExpiration: true,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return await this.authService.validate(payload.email);
  }
}
