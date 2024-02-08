import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from 'src/config/ auth.config';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  imports: [JwtModule.register(authConfig)],
})
export class AuthModule {}
