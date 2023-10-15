import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtAdminLabel } from '../../auth.const';

@Injectable()
export class LocalAdminGuard extends AuthGuard(jwtAdminLabel) {}

export function LocalAdminAuth() {
  return UseGuards(LocalAdminGuard);
}
