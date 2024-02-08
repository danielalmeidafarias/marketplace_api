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
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async getNewTokens(refresh_token: string) {
    const { sub, email } = this.jwtService.decode(refresh_token);

    return {
      access_token: this.jwtService.sign({ sub, email }, {
        expiresIn: '1h',
      }),
      refresh_token: this.jwtService.sign({ sub, email }, {
        expiresIn: '1d',
      }),
    };
  }
}
