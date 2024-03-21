import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Wallet } from './entity/wallet.entity';
import { UtilsModule } from '../utils/utils.module';
import { PagarmeModule } from '../Pagarme/pagarme.module';
import { JwtService } from '@nestjs/jwt';
import { WalletRepository } from './repository/wallet.repository';

@Module({
  controllers: [WalletController],
  providers: [WalletService, JwtService, WalletRepository],
  imports: [
    TypeOrmModule.forFeature([Wallet]), 
    AuthModule,
    UtilsModule, 
    PagarmeModule,
  ],
  exports: [WalletService, WalletRepository]
})
export class WalletModule {}
