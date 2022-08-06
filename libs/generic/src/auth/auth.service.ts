import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DeleteDto } from './dto/delete.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  register(body: RegisterDto) {}

  login(req: Request, body: LoginDto) {}

  delete(req: Request, body: DeleteDto) {}
}
