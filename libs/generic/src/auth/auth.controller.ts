import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { DeleteDto } from './dto/delete.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuth } from './guards/jwt.guard';
import { LocalAuth } from './guards/local.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    this.authService.register(body);
  }

  @ApiBody({ type: LoginDto })
  @LocalAuth()
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.authService.makeJwtToken(req.user, res);
    return req.user;
  }

  @JwtAuth()
  @Post('delete')
  delete(@Req() req: Request, @Body() body: DeleteDto) {
    return this.authService.delete(req, body);
  }

  @Get()
  findAll(@Req() request: Request) {
    request.session['visits'] = request.session['visits']
      ? request.session['visits'] + 1
      : 1;
    return request.session['visits'];
  }
}
