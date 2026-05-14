import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: 'access-secret-key-change-in-production',
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload, {
      secret: 'refresh-secret-key-change-in-production',
      expiresIn: '7d',
    });
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);

      const user = this.userRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        username: registerDto.username || registerDto.email.split('@')[0],
        role: Role.USER,
      });

      await this.userRepository.save(user);

      return { message: 'User registered successfully', userId: user.id };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepository.update(user.id, {
        refreshToken: hashedRefreshToken,
      });

      return {
        accessToken,
        refreshToken,
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }

  async refreshTokens(userId: number, oldRefreshToken: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Access denied');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        oldRefreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new ForbiddenException('Access denied');
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepository.update(user.id, {
        refreshToken: hashedRefreshToken,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to refresh tokens');
    }
  }

  async logout(userId: number) {
    try {
      await this.userRepository.update(userId, { refreshToken: '' });
      return { message: 'Logged out successfully' };
    } catch {
      throw new InternalServerErrorException('Failed to logout');
    }
  }

  async getProfile(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'email', 'username', 'role', 'created_at'],
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch profile');
    }
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (updateProfileDto.username) {
        user.username = updateProfileDto.username;
      }

      if (updateProfileDto.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(updateProfileDto.password, salt);
      }

      await this.userRepository.save(user);

      return {
        message: 'Profile updated successfully',
        username: user.username,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
