import 'dotenv/config.js';
import { JwtModuleOptions } from '@nestjs/jwt';

export const authConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY,
};
