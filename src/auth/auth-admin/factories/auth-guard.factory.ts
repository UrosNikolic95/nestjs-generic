import { Injectable, UseGuards } from '@nestjs/common';
import { IGenerateModule } from '../interfaces/generate-module.interface';
import { AuthGuard } from '@nestjs/passport';

export function authGuardFactory(data: IGenerateModule) {
  @Injectable()
  class JwtGuard extends AuthGuard(data.jwtLabel) {}

  function JwtAuth() {
    return UseGuards(JwtGuard);
  }

  data.JwtGuard = JwtGuard;
  data.JwtAuth = JwtAuth;

  @Injectable()
  class LocalGuard extends AuthGuard(data.localLabel) {}

  function LocalAuth() {
    return UseGuards(LocalGuard);
  }

  data.LocalGuard = LocalGuard;
  data.LocalAuth = LocalAuth;
}
