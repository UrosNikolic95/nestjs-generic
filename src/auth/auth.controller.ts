import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { DeleteDto } from './dto/delete.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { JwtAuth } from './guards/jwt.guard';
import { LocalAuth } from './guards/local.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  forgotPassword(body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  resetPassword(@Req() req: Request, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(req, body);
  }

  @Post('set-password/:hash')
  setPassword(@Param('hash') hash: string, @Body() body: SetPasswordDto) {
    return this.authService.setPassword(hash, body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiBody({ type: LoginDto })
  @LocalAuth()
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.authService.makeJwtToken(req.user, res);
    return req.user;
  }

  @JwtAuth()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    console.log(req.user);
    this.authService.removeJwtToken(res);
  }

  @JwtAuth()
  @Post('delete')
  delete(
    @Req() req: Request,
    @Body() body: DeleteDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('Authorization');
    return this.authService.delete(req, body);
  }
}
