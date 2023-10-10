import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtLabel } from '../auth.const';

@Injectable()
export class JwtGuard extends AuthGuard(jwtLabel) {}

export function JwtAuth() {
  return UseGuards(JwtGuard);
}
