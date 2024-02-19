import { ProductService } from './../Product/product.service';
import { AuthGuard } from './../auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { EditUserDTO } from './dto/edit-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { GetUserInfoDTO } from './dto/get-userInfo.dto';
import { FindProductsByIdDTO } from './dto/find-products-by-id';
import { CreateStoreByUserDTO } from '../Store/dto/create-store-by-user.dto';
import { StoreService } from '../Store/store.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private storeService: StoreService,
  ) {}

  @Post('/create')
  async create(
    @Body()
    {
      email,
      password,
      name,
      lastName,
      cep,
      cpf,
      dataNascimento,
      phone,
    }: CreateUserDTO,
    @Req() req: Request
  ) {
    console.log(req.body)
    return await this.userService.createUser({
      email,
      password,
      name,
      lastName,
      cep,
      cpf,
      dataNascimento,
      phone,
    });
  }

  @UseGuards(AuthGuard)
  @Post('createStore')
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

  @Post('/login')
  async login(@Body() { email, password }: LoginUserDTO) {
    return await this.userService.loginUser({ email, password });
  }

  @UseGuards(AuthGuard)
  @Get('/info')
  async getInfo(@Body() { access_token, refresh_token }: GetUserInfoDTO) {
    return await this.userService.getUser({
      access_token,
      refresh_token,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/edit')
  async edit(
    @Body()
    {
      access_token,
      refresh_token,
      email,
      password,
      newEmail,
      newPassword,
      newCEP,
      newName,
      newLastName,
      newPhone,
    }: EditUserDTO,
  ) {
    return await this.userService.editUser({
      access_token,
      refresh_token,
      email,
      password,
      newEmail,
      newPassword,
      newCEP,
      newName,
      newLastName,
      newPhone,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  delete(
    @Body() { access_token, refresh_token, email, password }: DeleteUserDTO,
  ) {
    return this.userService.deleteUser({
      access_token,
      refresh_token,
      email,
      password,
    });
  }
}
