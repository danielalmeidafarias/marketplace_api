import { AuthService } from './../auth/auth.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
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

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/create')
  async create(@Body() { email, password }: CreateUserDTO) {
    return await this.userService.createUser({ email, password });
  }

  @Post('/login')
  async login(@Body() { email, password }: LoginUserDTO) {
    return await this.userService.loginUser({ email, password });
  }

  @UseGuards(AuthGuard)
  @Get()
  async getInfo(@Query() { id, access_token, refresh_token }: GetUserInfoDTO) {
    return await this.userService.getUser({
      id,
      access_token,
      refresh_token,
    });
  }

  @UseGuards(AuthGuard)
  @Put()
  async edit(
    @Body() { access_token, refresh_token, email, password, newEmail, newPassword }: EditUserDTO,
  ) {
    return await this.userService.editUser({
      access_token,
      refresh_token,
      email,
      password,
      newEmail,
      newPassword
    });
  }

  @UseGuards(AuthGuard)
  @Delete()
  delete(@Query() { access_token, refresh_token, id }: DeleteUserDTO) {
    return this.userService.deleteUser({ access_token, refresh_token, id });
  }
}
