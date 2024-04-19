import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from 'src/config/auth.config';
import { AuthGuard } from './auth.guard';
import { UtilsModule } from '../Utils/utils.module';
import { UserModule } from '../User/user.module';
import { StoreModule } from '../Store/store.module';

@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  imports: [
    JwtModule.register(authConfig),
    UserModule,
    forwardRef(() => StoreModule),
    UtilsModule,
  ],
})
export class AuthModule {}
