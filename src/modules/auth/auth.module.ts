import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from 'src/config/auth.config';
import { AuthGuard } from './auth.guard';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  imports: [
    JwtModule.register(authConfig),
  ],
})
export class AuthModule {}
