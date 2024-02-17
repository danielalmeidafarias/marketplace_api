import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from '../Product/product.module';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    forwardRef(() => ProductModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, UtilsService],
  exports: [UserRepository],
})
export class UserModule {}
