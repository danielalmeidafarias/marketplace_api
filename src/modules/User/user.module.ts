import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from '../Product/product.module';
import { StoreModule } from '../Store/store.module';
import { UtilsModule } from 'src/modules/utils/utils.module';
import { PagarmeModule } from '../Pagarme/pagarme.module';
import { CartModule } from '../Cart/cart.module';
import { WalletModule } from '../Wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    forwardRef(() => ProductModule),
    forwardRef(() => StoreModule),
    forwardRef(() => UtilsModule),
    PagarmeModule,
    CartModule,
    WalletModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService],
  exports: [UserRepository],
})
export class UserModule {}
