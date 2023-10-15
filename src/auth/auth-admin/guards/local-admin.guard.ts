import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { localAdminLabel } from '../../auth.const';

@Injectable()
export class LocalAdminGuard extends AuthGuard(localAdminLabel) {}

export function LocalAdminAuth() {
  return UseGuards(LocalAdminGuard);
}
