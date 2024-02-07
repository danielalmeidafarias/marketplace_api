import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/User/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
