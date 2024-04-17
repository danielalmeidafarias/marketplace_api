import 'dotenv/config';
import { Module } from '@nestjs/common';
import { StoreModule } from './modules/Store/store.module';
import { ProductModule } from './modules/Product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from './config/database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { CartModule } from './modules/Cart/cart.module';
import { UserModule } from './modules/User/user.module';
import { WalletModule } from './modules/Wallet/wallet.module';
import { AddressModule } from './modules/Address/address.module';
import { OrderModule } from './modules/Order/order.module';
@Module({
  imports: [
    UserModule,
    ProductModule,
    AuthModule,
    StoreModule,
    CartModule,
    WalletModule,
    AddressModule,
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule.forRoot(),
    OrderModule,
  ],
})
export class AppModule {}
