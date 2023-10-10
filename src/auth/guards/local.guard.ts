import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { localLabel } from '../auth.const';

@Injectable()
export class LocalGuard extends AuthGuard(localLabel) {}

export function LocalAuth() {
  return UseGuards(LocalGuard);
}
