import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreService } from './store.service';
import { LoginStoreDTO } from './dto/login-store.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetStoreInfoDTO } from './dto/get-store-info.dto';

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

  @UseGuards(AuthGuard)
  @Get('/info')
  async getStoreInfo(@Body() { access_token, refresh_token }:  GetStoreInfoDTO) {
    return this.storeService.getStoreInfo({ access_token, refresh_token })
  }

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
