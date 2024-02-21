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
import { CreateStoreByUserDTO } from '../Store/dto/create-store-by-user.dto';
import { StoreService } from '../Store/store.service';
import {
  GetUserStoreInfoIdDTO,
  GetUserStoreInfoTokensDTO,
} from './dto/get-user-store-info.dto';
import {
  DeleteUserStoreIdDTO,
  DeleteUserStoreTokensDTO,
} from './dto/delete-user-store.dto';

@Controller('/user/store')
export class UserStoreController {
  constructor(private storeService: StoreService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async createStore(
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
  @Get('/info')
  async getStoreInfo(
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
  @Put('/edit')
  async editStore() {}

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteStore(
    @Query() { storeId }: DeleteUserStoreIdDTO,
    @Body() { access_token, refresh_token }: DeleteUserStoreTokensDTO,
  ) {
    return this.storeService.deleteUserStore({
      access_token,
      refresh_token,
      storeId,
    });
  }
}
