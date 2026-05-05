import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string; userId: number }> {
    return this.userService.register(registerDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; userId: number; email: string }> {
    return this.userService.login(loginDto);
  }
}
