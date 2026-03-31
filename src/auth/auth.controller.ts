/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(201)
  @Post('login')
  async login(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(LoginDto);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      partitioned: this.configService.get<string>('NODE_ENV') === 'production',
    });
    return {
      message: 'Sesión iniciada correctamente',
      user: {
        user_id: user.id,
        username: user.username,
      },
    };
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      message: 'Sesión cerrada correctamente',
    };
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
