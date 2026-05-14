import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  Res,
  UseGuards,
  InternalServerErrorException,
  HttpException,
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

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.userService.register(registerDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.userService.login(loginDto);

      response.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        message: 'Login successful',
        userId: result.userId,
        email: result.email,
        username: result.username,
        role: result.role,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    try {
      const user = req.user as { userId: number };
      return await this.userService.getProfile(user.userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch profile');
    }
  }

  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const user = req.user as { userId: number };
      return await this.userService.updateProfile(
        user.userId,
        updateProfileDto,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to refresh tokens');
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = req.user as { userId: number };
      await this.userService.logout(user.userId);

      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');

      return { message: 'Logged out successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to logout');
    }
  }
}
