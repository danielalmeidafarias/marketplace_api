import { UserRepository } from 'src/modules/User/repository/user.repository';
import { User } from 'src/modules/User/entity/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Store } from '../Store/entity/store.entity';
import { UtilsService } from '../utils/utils.service';
import { StoreRepository } from '../Store/repository/store.repository';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
  ) {}

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

  private async getNewTokens(access_token: string, refresh_token: string) {
    await this.decodeToken(access_token);
    const { id, email } = await this.decodeToken(refresh_token);

    try {
      await this.jwtService.verify(access_token);
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
        newAccess_token: access_token,
        newRefresh_token: this.jwtService.sign(
          { id, email },
          {
            expiresIn: '1d',
          },
        ),
      };
    }
  }

  private async getTokenId(access_token: string) {
    try {
      const { id } = await this.decodeToken(access_token);
      return id;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }

  private async verifyTokenId(access_token: string, userId: string) {
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

  async accountVerification(access_token: string, refresh_token: string) {
    const accountId = await this.getTokenId(access_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.verifyTokenId(access_token, account.id);

    const { newAccess_token, newRefresh_token } = await this.getNewTokens(
      access_token,
      refresh_token,
    );

    return { account, newAccess_token, newRefresh_token };
  }

  async userVerification(access_token: string, refresh_token: string) {
    const userId = await this.getTokenId(access_token);

    const user = await this.userRepository.verifyExistingUserById(userId);

    await this.verifyTokenId(access_token, user.id);

    const { newAccess_token, newRefresh_token } = await this.getNewTokens(
      access_token,
      refresh_token,
    );

    return {
      user,
      newAccess_token,
      newRefresh_token,
    };
  }

  async userLogin(email: string, password: string) {
    const user = await this.userRepository.verifyExistingUserByEmail(email);

    await this.utilsService.passwordIsCorrect(user.password, password);

    const { access_token, refresh_token } = await this.signIn(user);

    return {
      access_token,
      refresh_token,
    };
  }

  async storeVerification(access_token: string, refresh_token: string) {
    const storeId: UUID = await this.getTokenId(access_token);

    const store = await this.storeRepository.verifyExistingStoreById(storeId);

    await this.verifyTokenId(access_token, store.id);

    const { newAccess_token, newRefresh_token } = await this.getNewTokens(
      access_token,
      refresh_token,
    );

    return {
      store,
      newAccess_token,
      newRefresh_token,
    };
  }

  async storeLogin(email: string, password: string) {
    const store = await this.storeRepository.verifyExistingStoreByEmail(email);

    await this.utilsService.passwordIsCorrect(store.password, password);

    const { access_token, refresh_token } = await this.signIn(store);

    return {
      access_token,
      refresh_token,
    };
  }
}
