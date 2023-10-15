import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtLabel } from '../../auth.const';

@Injectable()
export class JwtAdminGuard extends AuthGuard(jwtLabel) {}

export function JwtAdminAuth() {
  return UseGuards(JwtAdminGuard);
}
