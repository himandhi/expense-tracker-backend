import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

function extractCookie(cookies: unknown, key: string): string | null {
  if (typeof cookies === 'object' && cookies !== null && key in cookies) {
    const value = (cookies as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : null;
  }
  return null;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          return extractCookie(request?.cookies, 'accessToken');
        },
      ]),
      secretOrKey: 'access-secret-key-change-in-production',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
