import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This guard protects routes — only authenticated users can access them
// It uses the 'jwt' strategy we defined above
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}
