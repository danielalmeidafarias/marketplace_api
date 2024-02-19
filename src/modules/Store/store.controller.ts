import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreService } from './store.service';
import { LoginStoreDTO } from './dto/login-store.dto';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post('/create')
  async createStore(
    @Body()
    { cep, cnpj, email, name, password, phone }: CreateStoreDTO,
  ) {
    return this.storeService.createStore({
      cep,
      cnpj,
      email,
      name,
      password,
      phone,
    });
  }

  @Post('/login')
  async storeLogin(@Body() { email, password }: LoginStoreDTO) {
    return this.storeService.login({ email, password });
  }

  // Protegida
  @Get()
  async getStoreInfo({ access_token, refresh_token }) {}

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
