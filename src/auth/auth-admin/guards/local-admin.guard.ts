import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { localLabel } from '../../auth.const';

@Injectable()
export class LocalAdminGuard extends AuthGuard(localLabel) {}

export function LocalAdminAuth() {
  return UseGuards(LocalAdminGuard);
}
