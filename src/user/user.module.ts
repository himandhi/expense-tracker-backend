import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccessTokenStrategy } from '../common/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '../common/strategies/refresh-token.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [TypeOrmModule],
})
export class UserModule {}
