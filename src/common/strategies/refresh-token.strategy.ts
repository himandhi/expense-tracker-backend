import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

interface JwtPayload {
  userId: number;
  email: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const cookies = request?.cookies as
            | Record<string, string>
            | undefined;
          return cookies?.refreshToken || null;
        },
      ]),
      secretOrKey: 'refresh-secret-key-change-in-production',
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: JwtPayload,
  ): { userId: number; email: string; refreshToken: string } {
    const cookies = req.cookies as Record<string, string>;
    const refreshToken: string = cookies?.refreshToken || '';
    return { ...payload, refreshToken };
  }
}
