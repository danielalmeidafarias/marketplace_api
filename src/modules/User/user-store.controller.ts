import { UserService } from './user.service';
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
  GetStoreInfoByUserTokensDTO,
  GetStoreInfoByUserIdDTO,
} from './dto/get-store-info.dto';
import { DeleteStoreByUserIdDTO, DeleteStoreByUserTokensDTO } from './dto/delete-store.dto';

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
    @Query() { storeId }: GetStoreInfoByUserIdDTO,
    @Body() { access_token, refresh_token }: GetStoreInfoByUserTokensDTO,
  ) {
    return this.storeService.getUserStoreInfo(access_token, storeId);
  }

  @UseGuards(AuthGuard)
  @Put('/edit')
  async editStore() {}

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteStore(
    @Query() { storeId }: DeleteStoreByUserIdDTO,
    @Body() { access_token, refresh_token }: DeleteStoreByUserTokensDTO,
  ) {}
}
