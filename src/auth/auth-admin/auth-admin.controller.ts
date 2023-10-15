import { Body, Controller, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { DeleteDto } from '../dto/delete.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { SetPasswordDto } from '../dto/set-password.dto';
import { JwtAuth } from '../guards/jwt.guard';
import { LocalAuth } from '../guards/local.guard';
import { AuthAdminService } from './auth-admin.service';

@ApiTags('auth')
@Controller('auth')
export class AuthAdminController {
  constructor(private readonly authService: AuthAdminService) {}

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
  @LocalAuth()
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.makeJwtToken(req.user, res);
    return req.user;
  }

  @JwtAuth()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    await this.authService.removeJwtToken(res, req);
  }

  @Post('verify-email/:code')
  async verifyEmail(@Param('code') code: string) {
    await this.authService.validateEmail(code);
  }

  @JwtAuth()
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
