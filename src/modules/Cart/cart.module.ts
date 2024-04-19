import { UtilsModule } from 'src/modules/Utils/utils.module';
import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartRepository } from './repository/cart.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { CartController } from './cart.controller';
import { AuthModule } from '../Auth/auth.module';
import { ProductModule } from '../Product/product.module';
import { JwtService } from '@nestjs/jwt';
import { PagarmeModule } from '../Pagarme/pagarme.module';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository, JwtService],
  exports: [CartService, CartRepository],
  imports: [
    TypeOrmModule.forFeature([Cart]),
    forwardRef(() => AuthModule),
    ProductModule,
    forwardRef(() => UtilsModule),
    PagarmeModule,
  ],
})
export class CartModule {}
