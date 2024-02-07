import { JwtSignOptions } from '@nestjs/jwt';

export const accessTokenConfig: JwtSignOptions = {
  privateKey: process.env.ACCESS_TOKEN_SECRET,
  expiresIn: '1d',
};

export const refreshTokenConfig: JwtSignOptions = {
  privateKey: process.env.REFRESH_TOKEN_SECRET,
  expiresIn: '7d',
};
