import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AddProductBodyDTO } from './dto/add-product.dto';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { DecrementProductDTO } from './dto/decrement-product.dto';
import { RemoveProductDTO } from './dto/remove-product.dto';
import { ClearCartDTO } from './dto/clear-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('/add')
  async addProduct(
    @Body()
    { productId, quantity, access_token, refresh_token }: AddProductBodyDTO,
  ) {
    return this.cartService.addCartProduct(access_token, productId, quantity);
  }

  @UseGuards(AuthGuard)
  @Post('/decrement')
  async decrementProduct(
    @Body()
    { productId, quantity, access_token, refresh_token }: DecrementProductDTO,
  ) {
    return this.cartService.decrementProduct(access_token, productId, quantity);
  }

  @UseGuards(AuthGuard)
  @Post('/remove')
  async RemoveProduct(
    @Body()
    { productId, access_token, refresh_token }: RemoveProductDTO,
  ) {
    return this.cartService.removeProduct(access_token, productId);
  }

  @UseGuards(AuthGuard)
  @Post('/clear')
  async clearCart(
    @Body()
    { access_token, refresh_token }: ClearCartDTO,
  ) {
    return this.cartService.clearCart(access_token);
  }
}
