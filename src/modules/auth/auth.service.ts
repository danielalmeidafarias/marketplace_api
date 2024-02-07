import { User } from 'src/modules/User/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { accessTokenConfig, refreshTokenConfig } from 'src/config/ auth.config';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(user: User) {
    const payload = { sub: user.id, email: user.email };

    // Rever a aplicacao do AuthModule para abstrair melhor informacoes sensiveis
    // JwtModule
    return {
      access_token: await this.jwtService.signAsync(payload, {
        privateKey: process.env.ACCESS_TOKEN_SECRET,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        privateKey: process.env.REFRESH_TOKEN_SECRET,
      }),
    };
  }
}
