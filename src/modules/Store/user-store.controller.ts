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
import { AuthGuard } from '../auth/auth.guard';
import { CreateStoreByUserDTO } from '../User/dto/create-user-store.dto';
import { StoreService } from './store.service';
import {
  GetUserStoreInfoIdDTO,
  GetUserStoreInfoTokensDTO,
} from '../User/dto/get-user-store-info.dto';
import {
  DeleteUserStoreIdDTO,
  DeleteUserStoreTokensDTO,
} from '../User/dto/delete-user-store.dto';
import { EditUserStoreDTO } from '../User/dto/edit-user-store.dto';

@Controller('/user/store')
export class UserStoreController {
  constructor(private storeService: StoreService) {}

  @UseGuards(AuthGuard)
  @Post('/user/create')
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

  @UseGuards(AuthGuard)
  @Get('/user/info')
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
  @Put('/user/update')
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
  @Delete('/user/delete')
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
}
