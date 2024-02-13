import { UserRepository } from './repository/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { GetUserInfoDTO } from './dto/get-userInfo.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { EditUserDTO } from './dto/edit-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { UUID } from 'crypto';
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async createUser({ email, password }: CreateUserDTO) {
    const alreadyUser = await this.userRepository.findUserByEmail(email);

    if (alreadyUser) {
      throw new HttpException(
        `O email ${email} já possui uma conta registrada`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User(email, hashedPassword);

    await this.userRepository.createUser(user);

    const { access_token, refresh_token } = await this.authService.signIn(user);

    return {
      access_token,
      refresh_token,
      id: user.id,
    };
  }

  async loginUser({ email, password }: LoginUserDTO) {
    const user = await this.userRepository.verifyExistingUserByEmail(email);

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      throw new HttpException(
        'A senha digitada está incorreta',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { access_token, refresh_token } = await this.authService.signIn(user);
    return {
      access_token,
      refresh_token,
      id: user.id,
    };
  }

  async getUser({ id, access_token }: GetUserInfoDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    await this.authService.verifyTokenId(newAccess_token, id);

    await this.authService.verifyTokenId(newAccess_token, user.id);

    return {
      response: await this.userRepository.getUserInfo(id),
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async editUser({
    access_token,
    email,
    password,
    newPassword,
    newEmail,
  }: EditUserDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const user = await this.userRepository.verifyExistingUserByEmail(email);

    await this.authService.verifyTokenId(newAccess_token, user.id);

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      throw new HttpException(
        'A senha digitada está incorreta',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const editedUser: { id: UUID; email: string; password: string } = {
      id: user.id,
      email: newEmail ? newEmail : user.email,
      password: newPassword ? bcrypt.hashSync(newPassword, 10) : password,
    };

    if (
      editedUser.email === user.email &&
      editedUser.password === user.password
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.editUser(
      editedUser.id,
      editedUser.email,
      editedUser.password,
    );

    return {
      message: 'Usuario editado com sucesso!',
      user: editedUser,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteUser({ access_token, id }: DeleteUserDTO) {
    const { newAccess_token } =
      await this.authService.getNewTokens(access_token);

    const user = await this.userRepository.verifyExistingUserById(id);

    await this.authService.verifyTokenId(newAccess_token, id);

    await this.userRepository.deleteUser(id, user?.email);

    return {
      message: 'Usuario deletado com sucesso!',
    };
  }
}
