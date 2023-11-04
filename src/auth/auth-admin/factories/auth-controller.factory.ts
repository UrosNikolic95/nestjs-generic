import { Controller, Post, Body, Req, Param, Res } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { DeleteDto } from '../../dto/delete.dto';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { InvitationDto } from '../../dto/invitation.dto';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { SetPasswordDto } from '../../dto/set-password.dto';
import { AuthAdminService } from '../auth-admin.service';
import { JwtAdminAuth } from '../guards/jwt-admin.guard';
import { LocalAdminAuth } from '../guards/local-admin.guard';
import { IGenerateModule } from '../interfaces/generate-module.interface';
import { Request, Response } from 'express';

export function authControllerFactory(data: IGenerateModule) {
  @ApiTags(`auth/${data.name}`)
  @Controller(`auth/${data.name}`)
  class AuthController {
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

    @Post('invite')
    invite(@Body() body: InvitationDto) {
      return this.authService.invite(body);
    }

    @Post('register')
    register(@Body() body: RegisterDto) {
      return this.authService.register(body);
    }

    @ApiBody({ type: LoginDto })
    @LocalAdminAuth()
    @Post('login')
    async login(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      await this.authService.makeJwtToken(req.user, res);
      return req.user;
    }

    @JwtAdminAuth()
    @Post('logout')
    async logout(
      @Res({ passthrough: true }) res: Response,
      @Req() req: Request,
    ) {
      await this.authService.removeJwtToken(res, req);
    }

    @JwtAdminAuth()
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

  data.AuthController = AuthController;
}
