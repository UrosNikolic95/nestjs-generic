import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtAdminLabel } from '../../auth.const';

@Injectable()
export class JwtAdminGuard extends AuthGuard(jwtAdminLabel) {}

export function JwtAdminAuth() {
  return UseGuards(JwtAdminGuard);
}
