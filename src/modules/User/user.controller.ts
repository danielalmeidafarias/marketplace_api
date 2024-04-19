import { AuthService } from '../Auth/auth.service';
import { AuthGuard } from '../Auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { GetUserInfoDTO } from './dto/get-user-Info.dto';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/create')
  async create(
    @Body()
    {
      email,
      password,
      name,
      cep,
      numero,
      complemento,
      cpf,
      birthdate,
      mobile_phone,
      home_phone,
      ponto_referencia,
    }: CreateUserDTO,
  ) {
    return await this.userService.createUser({
      email,
      password,
      name,
      incomingCep: cep,
      numero,
      complemento,
      incomingCpf: cpf,
      birthdate,
      incomingMobilePhone: mobile_phone,
      incomingHomePhone: home_phone,
      ponto_referencia,
    });
  }

  @Post('/login')
  async login(@Body() { email, password }: LoginUserDTO) {
    return await this.authService.userLogin(email, password);
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
  @Put('/update')
  async update(
    @Body()
    {
      access_token,
      refresh_token,
      password,
      newEmail,
      newPassword,
      newCEP,
      newNumero,
      newComplemento,
      newName,
      newMobilePhone,
      newHomePhone,
    }: UpdateUserDTO,
  ) {
    return await this.userService.updateUser({
      access_token,
      refresh_token,
      password,
      newEmail,
      newPassword,
      newCEP,
      newNumero,
      newComplemento,
      newName,
      newMobilePhone,
      newHomePhone,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async delete(
    @Body() { access_token, refresh_token, password }: DeleteUserDTO,
  ) {
    return await this.userService.deleteUser({
      access_token,
      refresh_token,
      password,
    });
  }
}
