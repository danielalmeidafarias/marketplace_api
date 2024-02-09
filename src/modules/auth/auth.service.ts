import { User } from 'src/modules/User/entity/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
      }),
    };
  }

  private async decodeToken(token: string) {
    try {
      const { sub, email } = await this.jwtService.decode(token);
      return { sub, email };
    } catch {
      throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
    }
  }

  async getNewTokens(acces_token: string) {
    const { sub, email } = await this.decodeToken(acces_token);

    try {
      await this.jwtService.verify(acces_token);
    } catch {
      return {
        newAccess_token: this.jwtService.sign(
          { sub, email },
          {
            expiresIn: '1h',
          },
        ),
        newRefresh_token: this.jwtService.sign(
          { sub, email },
          {
            expiresIn: '1d',
          },
        ),
      };
    } finally {
      return {
        newAccess_token: acces_token,
        newRefresh_token: this.jwtService.sign(
          { sub, email },
          {
            expiresIn: '1d',
          },
        ),
      };
    }
  }

  async verifyTokenId(access_token: string, id: UUID) {
    try {
      const { sub } = await this.decodeToken(access_token);

      if (id !== sub) {
        throw new HttpException(
          'Access_token and Id must match',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch {
      throw new UnauthorizedException();
    }
  }
}
