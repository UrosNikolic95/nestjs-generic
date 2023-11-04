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
  class LocalAdminGuard extends AuthGuard(data.localLabel) {}

  function LocalAdminAuth() {
    return UseGuards(LocalAdminGuard);
  }

  data.LocalGuard = LocalAdminGuard;
  data.LocalAuth = LocalAdminAuth;
}
