import { User } from 'src/modules/User/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
        algorithm: 'HS256',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        algorithm: 'HS384',
      }),
    };
  }
}
