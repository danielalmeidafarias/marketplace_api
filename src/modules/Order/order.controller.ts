import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../Auth/auth.guard';
import { GetOrdersDTO } from './dto/get-order.dto';
import { GetOrderBodyDTO, GetOrderQueryDTO } from './dto/get-orders.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Get('/order')
  async getOne(
    @Body() { access_token, refresh_token }: GetOrderBodyDTO,
    @Query() { order_id }: GetOrderQueryDTO,
  ) {
    return await this.orderService.getOne(
      access_token,
      refresh_token,
      order_id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/orders')
  async getAll(@Body() { access_token, refresh_token }: GetOrdersDTO) {
    return await this.orderService.getAll(access_token, refresh_token);
  }
}
