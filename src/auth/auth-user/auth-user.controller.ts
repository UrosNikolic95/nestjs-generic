import { Body, Controller, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthUserService } from './auth-user.service';
import { DeleteDto } from '../dto/delete.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { SetPasswordDto } from '../dto/set-password.dto';
import { LocalUserStrategy } from './strategies/user-local.strategy';
import { JwtUserStrategy } from './strategies/user-jwt.strategy';
import { JwtUserAuth } from './guards/jwt.guard';
import { LocalUserAuth } from './guards/local.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthUserController {
  constructor(private readonly authService: AuthUserService) {}

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  resetPassword(@Req() req: Request, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(req.user, body);
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
  @LocalUserAuth()
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.makeJwtToken(req.user, res);
    return req.user;
  }

  @JwtUserAuth()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    await this.authService.removeJwtToken(res, req);
  }

  @Post('verify-email/:code')
  async verifyEmail(@Param('code') code: string) {
    await this.authService.validateEmail(code);
  }

  @JwtUserAuth()
  @Post('delete')
  delete(
    @Req() req: Request,
    @Body() body: DeleteDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('Authorization');
    return this.authService.delete(req.user, body);
  }
}
