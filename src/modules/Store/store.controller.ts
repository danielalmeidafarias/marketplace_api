import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) { }
  // Protegida
  @Post('/create')
  async createStore(
    @Body()
    {
      access_token,
      refresh_token,
      cep,
      email,
      name,
      password,
      phone,
      cpnj
    }: CreateStoreDTO,
  ) {
    return this.storeService.createStore({
      access_token,
      cep,
      email,
      name,
      password,
      phone,
      refresh_token,
      cpnj
    });
  }

  // Protegida
  @Get()
  async getStoreInfo({ access_token, refresh_token, id }) { }

  // Protegida
  @Put()
  async updateStore() { }

  // Protegida
  @Delete()
  async deleteStore() { }

  @Get()
  async getStore() { }

  @Get()
  async searchProduct() { }

  @Get()
  async getOrders() { }
}
