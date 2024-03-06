import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { LoginStoreDTO } from './dto/login-store.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  GetStoreInfoDTO,
  GetUserStoreInfoQueryDTO,
} from './dto/get-store-info.dto';
import { CreateStoreDTO, CreateUserStoreDTO } from './dto/create-store.dto';
import { UpdateStoreDTO } from './dto/update-store.dto';
import {
  DeleteStoreBodyDTO,
  DeleteUserStoreQueryDTO,
} from './dto/delete-store.dto';
import { SearchStoreDTO } from './dto/search-store.dto';
import {
  SearchStoreProductDTOQuery,
} from './dto/search-store-product.dto';
@Controller()
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post('/store/create')
  async createStore(
    @Body()
    {
      cep,
      numero,
      complemento,
      cnpj,
      email,
      name,
      password,
      mobile_phone,
      home_phone,
      birthdate,
      account_check_digit,
      account_number,
      account_type,
      annual_revenue,
      bank_digit,
      branch_check_digit,
      branch_number,
      ponto_referencia,
      tranding_name
    }: CreateStoreDTO,
  ) {
    return await this.storeService.createStore({
      cep,
      numero,
      complemento,
      ponto_referencia,
      cnpj,
      email,
      name,
      password,
      mobile_phone,
      home_phone,
      birthdate,
      bank_digit,
      branch_number,
      branch_check_digit,
      account_number,
      account_check_digit,
      account_type,
      annual_revenue,
      tranding_name
    });
  }

  @UseGuards(AuthGuard)
  @Post('/user/store/create')
  async createUserStore(
    @Body()
    {
      access_token,
      refresh_token,
      monthly_income,
      professional_occupation,
      bank_digit,
      branch_number,
      branch_check_digit,
      account_number,
      account_check_digit,
      account_type
    }: CreateUserStoreDTO,
  ) {
    return await this.storeService.createStoreByUser({
      access_token,
      refresh_token,
      monthly_income,
      professional_occupation,
      bank_digit,
      branch_number,
      branch_check_digit,
      account_number,
      account_check_digit,
      account_type
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
    @Query() { storeId }: GetUserStoreInfoQueryDTO,
    @Body() { access_token, refresh_token }: GetStoreInfoDTO,
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
      newNumero,
      newComplemento,
      newEmail,
      newName,
      newPassword,
      newHomePhone, 
      newMobilePhone
    }: UpdateStoreDTO,
  ) {
    return await this.storeService.updateStore({
      access_token,
      refresh_token,
      password,
      newCEP,
      newNumero,
      newComplemento,
      newEmail,
      newName,
      newPassword,
      newHomePhone, 
      newMobilePhone
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/store/delete')
  async deleteStore(
    @Body() { access_token, refresh_token, password }: DeleteStoreBodyDTO,
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
    @Query() { storeId }: DeleteUserStoreQueryDTO,
    @Body() { access_token, refresh_token, password }: DeleteStoreBodyDTO,
  ) {
    return this.storeService.deleteUserStore({
      access_token,
      refresh_token,
      password,
      storeId,
    });
  }

  @Get('/store/search')
  async searchStore(@Query() { name, id }: SearchStoreDTO) {
    return this.storeService.searchStore(name, id);
  }

  @Get('/store/:id/products')
  async searchStoreProduct(
    @Param('id', new ParseUUIDPipe()) id,
    @Query() { name, productId }: SearchStoreProductDTOQuery,
  ) {
    return await this.storeService.searchProducts(id, name, productId);
  }
}
