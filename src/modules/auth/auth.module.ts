import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleConfig } from 'src/config/ auth.config';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [JwtModule.register(JwtModuleConfig)],
})
export class AuthModule {}
