import { Module, forwardRef } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { StoreRepository } from './repository/store.repository';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../User/user.module';
import { JwtService } from '@nestjs/jwt';
import { UtilsModule } from 'src/modules/utils/utils.module';
import { ProductModule } from '../Product/product.module';
import { PagarmeModule } from '../Pagarme/pagarme.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entity/store.entity';
import { CartModule } from '../Cart/cart.module';
import { WalletModule } from '../Wallet/wallet.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService, StoreRepository, JwtService],
  imports: [
    TypeOrmModule.forFeature([Store]),
    AuthModule,
    UserModule,
    UtilsModule,
    ProductModule,
    PagarmeModule,
    CartModule,
    WalletModule,
  ],
  exports: [StoreService, StoreRepository],
})
export class StoreModule {}
