import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { LoginStoreDTO } from './dto/login-store.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetStoreInfoDTO, GetUserStoreInfoQueryDTO } from './dto/get-store-info.dto';
import { CreateStoreDTO, CreateUserStoreDTO } from './dto/create-store.dto';
import { UpdateStoreDTO } from './dto/update-store.dto';
import { UpdateProductUserQuery } from '../Product/dto/update-product.dto';
import { DeleteStoreBodyDTO, DeleteUserStoreQueryDTO } from './dto/delete-store.dto';
@Controller()
export class StoreController {
  constructor(private storeService: StoreService) { }

  @Post('/store/create')
  async createStore(
    @Body()
    { cep, cnpj, email, name, password, phone }: CreateStoreDTO,
  ) {
    return await this.storeService.createStore({
      cep,
      cnpj,
      email,
      name,
      password,
      phone,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/user/store/create')
  async createUserStore(
    @Body()
    {
      access_token,
      refresh_token,
      cep,
      email,
      name,
      phone,
      cnpj,
    }: CreateUserStoreDTO,
  ) {
    const password = '232'
    return await this.storeService.createStoreByUser({ access_token, name, email, phone, cnpj, cep });
  }

  @Post('/store/login')
  async storeLogin(@Body() { email, password }: LoginStoreDTO) {
    return await this.storeService.login({ email, password });
  }

  @UseGuards(AuthGuard)
  @Get('/store/info')
  async getStoreInfo(@Body() { access_token, refresh_token }: GetStoreInfoDTO) {
    return await this.storeService.getStoreInfo({
      access_token
    });
  }

  @UseGuards(AuthGuard)
  @Get('/user/store/info')
  async getUserStoreInfo(
    @Query() { storeId }: GetUserStoreInfoQueryDTO,
    @Body() { access_token, refresh_token }: GetStoreInfoDTO,
  ) {
    return this.storeService.getUserStoreInfo({
      access_token,
      storeId,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/store/update')
  async updateStore(
    @Body()
    {
      access_token,
      refresh_token,
      password,
      newCEP,
      newEmail,
      newName,
      newPassword,
      newPhone,
    }: UpdateStoreDTO,
  ) {
    return await this.storeService.updateStore({
      access_token,
      password,
      newCEP,
      newEmail,
      newName,
      newPassword,
      newPhone,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/user/store/update')
  async updateUserStore(
    @Body()
    {
      access_token,
      refresh_token,
      password,
      newCEP,
      newEmail,
      newName,
      newPhone,
    }: UpdateStoreDTO,
    @Query() { storeId }: UpdateProductUserQuery
  ) {
    return this.storeService.updateUserStore({
      access_token,
      password,
      storeId,
      newCEP,
      newEmail,
      newName,
      newPhone,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/store/delete')
  async deleteStore(
    @Body() { access_token, refresh_token, password }: DeleteStoreBodyDTO,
  ) {
    return await this.storeService.deleteStore({
      access_token,
      password,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/user/store/delete')
  async deleteUserStore(
    @Query() { storeId }: DeleteUserStoreQueryDTO,
    @Body() { access_token, refresh_token, password }: DeleteStoreBodyDTO,
  ) {
    return this.storeService.deleteUserStore({
      access_token,
      password,
      storeId,
    });
  }

  @Get()
  async getStore() { }

  @Get('/products')
  async searchProduct() { }

  @Get('/orders')
  async getOrders() { }
}
