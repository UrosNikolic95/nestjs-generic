import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { DeleteDto } from './dto/delete.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    this.authService.register(body);
  }

  @Post('login')
  login(@Req() req: Request, @Body() body: LoginDto) {
    return this.authService.login(req, body);
  }

  @Post('delete')
  delete(@Req() req: Request, @Body() body: DeleteDto) {
    return this.authService.delete(req, body);
  }
}
