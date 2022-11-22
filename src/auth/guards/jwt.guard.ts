import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    return !!user;
  }
}

export function JwtAuth() {
  return UseGuards(JwtGuard);
}
