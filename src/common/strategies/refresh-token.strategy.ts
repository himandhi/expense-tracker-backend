import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

interface JwtPayload {
  userId: number;
  email: string;
}

function extractCookie(cookies: unknown, key: string): string | null {
  if (typeof cookies === 'object' && cookies !== null && key in cookies) {
    const value = (cookies as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : null;
  }
  return null;
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
          return extractCookie(request?.cookies, 'refreshToken');
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
    const refreshToken = extractCookie(req?.cookies, 'refreshToken');
    return { ...payload, refreshToken: refreshToken ?? '' };
  }
}
