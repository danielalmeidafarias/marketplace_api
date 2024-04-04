import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { PagarmeModule } from '../Pagarme/pagarme.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [WalletController],
  providers: [WalletService, JwtService],
  imports: [
    AuthModule,
    UtilsModule, 
    PagarmeModule,
  ],
  exports: [WalletService]
})
export class WalletModule {}
