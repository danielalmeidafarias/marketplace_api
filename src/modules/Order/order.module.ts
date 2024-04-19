import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PagarmeModule } from '../Pagarme/pagarme.module';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../Auth/auth.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, JwtService],
  imports: [PagarmeModule, AuthModule],
})
export class OrderModule {}
