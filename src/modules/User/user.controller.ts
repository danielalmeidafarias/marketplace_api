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
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { EditUserDTO } from './dto/edit-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { GetUserInfoDTO } from './dto/get-userInfo.dto';
import { FindProductsByIdDTO } from './dto/find-products-by-id';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private productService: ProductService,
  ) {}

  @Post('/create') 
  async create(@Body() { email, password, name, lastName,cep,cpf, dataNascimento, phone }: CreateUserDTO) {
    return await this.userService.createUser({ email, password, name, lastName,cep, cpf, dataNascimento, phone });
  }

  @Post('/login')
  async login(@Body() { email, password }: LoginUserDTO) {
    return await this.userService.loginUser({ email, password });
  }

  // @Get('/products')
  // async getUserProducts(@Query() { id }: FindProductsByIdDTO) {
  //   return await this.productService.findByUserId(id);
  // }

  @UseGuards(AuthGuard)
  @Get('/info')
  async getInfo(@Query() { id, access_token, refresh_token }: GetUserInfoDTO) {
    return await this.userService.getUser({
      id,
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
      newCPF,
      newName,
      newLastName,
      newPhone
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
      newCPF,
      newName,
      newLastName,
      newPhone,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  delete(@Query() { access_token, refresh_token, id }: DeleteUserDTO) {
    return this.userService.deleteUser({ access_token, refresh_token, id });
  }
}
