import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}
  // Protegida
  @Post()
  async createStore(
    @Body()
    {
      access_token,
      refresh_token,
      name,
      email,
      cpnj,
      cpf,
      cep,
      phone,
      userId,
    }: CreateStoreDTO,
  ) {
    return this.storeService.createStore({
      access_token,
      refresh_token,
      name,
      email,
      cpnj,
      cpf,
      cep,
      phone,
      userId,
    });
  }

  // Protegida
  @Get()
  async getStoreInfo({ access_token, refresh_token, id }) {}

  // Protegida
  @Put()
  async updateStore() {}

  // Protegida
  @Delete()
  async deleteStore() {}

  @Get()
  async getStore() {}

  @Get()
  async searchProduct() {}

  @Get()
  async getOrders() {}
}
