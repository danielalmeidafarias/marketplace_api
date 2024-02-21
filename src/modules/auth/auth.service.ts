import { User } from 'src/modules/User/entity/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Store } from '../Store/entity/store.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(user: User | Store) {
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
      return { id: sub, email };
    } catch (err) {
      console.error(err);
      throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
    }
  }

  async getNewTokens(acces_token: string) {
    const { id, email } = await this.decodeToken(acces_token);

    try {
      await this.jwtService.verify(acces_token);
    } catch {
      return {
        newAccess_token: this.jwtService.sign(
          { id, email },
          {
            expiresIn: '1h',
          },
        ),
        newRefresh_token: this.jwtService.sign(
          { id, email },
          {
            expiresIn: '1d',
          },
        ),
      };
    } finally {
      return {
        newAccess_token: acces_token,
        newRefresh_token: this.jwtService.sign(
          { id, email },
          {
            expiresIn: '1d',
          },
        ),
      };
    }
  }

  async getTokenId(access_token: string) {
    try {
      const { id } = await this.decodeToken(access_token);
      return id;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }

  async verifyTokenId(access_token: string, userId: string) {
    try {
      const { id } = await this.decodeToken(access_token);
      if (id !== userId) {
        throw new HttpException(
          'Access_token and userId must match',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
