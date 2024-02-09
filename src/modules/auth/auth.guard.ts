import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { authConfig } from 'src/config/ auth.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private getRequestTokens(request: Request) {
    if (request.method === 'POST' || request.method === 'PUT') {
      const { access_token, refresh_token } = request.body;
      return { access_token, refresh_token };
    }

    const { access_token, refresh_token } = request.query;
    return { access_token, refresh_token };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { access_token, refresh_token } = this.getRequestTokens(request);

    if (!access_token) {
      throw new HttpException(
        'access_token is missing in request',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!refresh_token) {
      throw new HttpException(
        'refresh_token is missing in request',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.jwtService.verify(access_token, authConfig);
    } catch {
      try {
        await this.jwtService.verify(refresh_token, authConfig);
      } catch {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
