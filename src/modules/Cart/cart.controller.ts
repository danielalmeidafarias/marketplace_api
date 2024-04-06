import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AddProductBodyDTO } from './dto/add-product.dto';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { DecrementProductDTO } from './dto/decrement-product.dto';
import { RemoveProductDTO } from './dto/remove-product.dto';
import { ClearCartDTO } from './dto/clear-cart.dto';
import { CreditCardOrderDTO, PixOrderDTO } from './dto/make-order.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('/add')
  async addProduct(
    @Body()
    { productId, quantity, access_token, refresh_token }: AddProductBodyDTO,
  ) {
    return this.cartService.addCartProduct(
      access_token,
      refresh_token,
      productId,
      quantity,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/decrement')
  async decrementProduct(
    @Body()
    { productId, quantity, access_token, refresh_token }: DecrementProductDTO,
  ) {
    return this.cartService.decrementProduct(
      access_token,
      refresh_token,
      productId,
      quantity,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/remove')
  async RemoveProduct(
    @Body()
    { productId, access_token, refresh_token }: RemoveProductDTO,
  ) {
    return this.cartService.removeProduct(
      access_token,
      refresh_token,
      productId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/clear')
  async clearCart(
    @Body()
    { access_token, refresh_token }: ClearCartDTO,
  ) {
    return this.cartService.clearCart(access_token, refresh_token);
  }

  @UseGuards(AuthGuard)
  // @Post('/order?method=credit_card')
  @Post('/order/credit_card')
  async creditCardOrder(
    @Body()
    {
      access_token,
      refresh_token,
      installments,
      card_id,
      cvv,
    }: CreditCardOrderDTO,
  ) {
    return this.cartService.creditCardOrder(
      access_token,
      refresh_token,
      installments,
      card_id,
      cvv,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/order/pix')
  async pixOrder(@Body() { access_token, refresh_token }: PixOrderDTO) {
    return this.cartService.PixOrder(access_token, refresh_token);
  }
}
