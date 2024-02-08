import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { EditUserDTO } from './dto/edit-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { GetUserInfoDTO } from './dto/get-userInfo.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  create(@Body() { email, password }: CreateUserDTO) {
    return this.userService.createUser({ email, password });
  }

  @Post('/login')
  login(@Body() { email, password }: LoginUserDTO) {
    return this.userService.loginUser({ email, password });
  }

  @Get()
  getInfo(@Query() { id }: GetUserInfoDTO) {
    return this.userService.getUser({ id });
  }

  @Put()
  edit(@Body() { access_token, refresh_token, email, password }: EditUserDTO) {
    return this.userService.editUser({
      access_token,
      refresh_token,
      email,
      password,
    });
  }

  @Delete()
  delete(@Query() { access_token, refresh_token }: DeleteUserDTO) {
    return this.userService.deleteUser({ access_token, refresh_token });
  }
}
