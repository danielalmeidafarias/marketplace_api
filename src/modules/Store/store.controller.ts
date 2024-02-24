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
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreService } from './store.service';
import { LoginStoreDTO } from './dto/login-store.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetStoreInfoDTO } from './dto/get-store-info.dto';
import { DeleteStoreDTO } from './dto/delete-store.dto';
import { EditStoreDTO } from './dto/edit-store.dto';
import { CreateStoreByUserDTO } from '../User/dto/create-user-store.dto';
import { DeleteUserStoreIdDTO, DeleteUserStoreTokensDTO } from '../User/dto/delete-user-store.dto';
import { EditUserStoreDTO } from '../User/dto/edit-user-store.dto';
import { GetUserStoreInfoIdDTO, GetUserStoreInfoTokensDTO } from '../User/dto/get-user-store-info.dto';
@Controller()
export class StoreController {
  constructor(private storeService: StoreService) {}

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
    }: CreateStoreByUserDTO,
  ) {
    return await this.storeService.createStoreByUser({
      access_token,
      refresh_token,
      cep,
      email,
      name,
      phone,
      cnpj,
    });
  }

  @Post('/store/login')
  async storeLogin(@Body() { email, password }: LoginStoreDTO) {
    return await this.storeService.login({ email, password });
  }

  @UseGuards(AuthGuard)
  @Get('/store/info')
  async getStoreInfo(@Body() { access_token, refresh_token }: GetStoreInfoDTO) {
    return await this.storeService.getStoreInfo({
      access_token,
      refresh_token,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/user/store/info')
  async getUserStoreInfo(
    @Query() { storeId }: GetUserStoreInfoIdDTO,
    @Body() { access_token, refresh_token }: GetUserStoreInfoTokensDTO,
  ) {
    return this.storeService.getUserStoreInfo({
      access_token,
      refresh_token,
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
    }: EditStoreDTO,
  ) {
    return await this.storeService.editStore({
      access_token,
      refresh_token,
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
  async editUserStore(
    @Body()
    {
      access_token,
      refresh_token,
      password,
      storeId,
      newCEP,
      newEmail,
      newName,
      newPhone,
    }: EditUserStoreDTO,
  ) {
    return this.storeService.editUserStore({
      access_token,
      refresh_token,
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
    @Body() { access_token, refresh_token, password }: DeleteStoreDTO,
  ) {
    return await this.storeService.deleteStore({
      access_token,
      refresh_token,
      password,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/user/store/delete')
  async deleteUserStore(
    @Query() { storeId }: DeleteUserStoreIdDTO,
    @Body() { access_token, refresh_token, password }: DeleteUserStoreTokensDTO,
  ) {
    return this.storeService.deleteUserStore({
      access_token,
      refresh_token,
      password,
      storeId,
    });
  }

  @Get()
  async getStore() {}

  @Get('/products')
  async searchProduct() {}

  @Get('/orders')
  async getOrders() {}
}
