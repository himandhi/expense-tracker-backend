import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Public } from '../common/decorators/public.decorator';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  // PUBLIC: No authentication needed
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  // PUBLIC: No authentication needed
  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.login(loginDto);

    // Set access token as HTTP-only cookie
    response.cookie('accessToken', result.accessToken, {
      httpOnly: true, // JavaScript can't access this cookie (XSS protection)
      secure: false, // Set to true in production (HTTPS only)
      sameSite: 'lax', // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    // Set refresh token as HTTP-only cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Return user info (without tokens — they're in cookies now)
    return {
      message: 'Login successful',
      userId: result.userId,
      email: result.email,
      username: result.username,
      role: result.role,
    };
  }

  // PROTECTED: Needs valid access token
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.userService.getProfile(user.userId);
  }

  // PROTECTED: Needs valid access token
  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = req.user as { userId: number };
    return this.userService.updateProfile(user.userId, updateProfileDto);
  }

  // PUBLIC: Uses refresh token to get new access token
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user as {
      userId: number;
      refreshToken: string;
    };

    const tokens = await this.userService.refreshTokens(
      user.userId,
      user.refreshToken,
    );

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Tokens refreshed successfully' };
  }

  // PROTECTED: Logout — clear cookies
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user as { userId: number };
    await this.userService.logout(user.userId);

    // Clear cookies
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }
}
