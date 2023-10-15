import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { localLabel } from '../../auth.const';

@Injectable()
export class LocalUserGuard extends AuthGuard(localLabel) {}

export function LocalUserAuth() {
  return UseGuards(LocalUserGuard);
}
