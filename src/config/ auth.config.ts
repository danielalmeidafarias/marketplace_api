require('dotenv').config();
import { JwtModuleOptions } from '@nestjs/jwt';

export const JwtModuleConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY,
};
