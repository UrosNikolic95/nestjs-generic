import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtLabel } from '../../auth.const';

@Injectable()
export class JwtUserGuard extends AuthGuard(jwtLabel) {}

export function JwtUserAuth() {
  return UseGuards(JwtUserGuard);
}
