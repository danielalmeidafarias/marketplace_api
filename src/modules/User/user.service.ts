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

    return this.authService.signIn(user);
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

    return this.authService.signIn(user);
  }

  async getUser({ id, access_token, refresh_token }: GetUserInfoDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token, refresh_token);

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
    refresh_token,
    email,
    password,
    newPassword,
    newEmail,
  }: EditUserDTO) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token, refresh_token);

    const user = await this.userRepository.verifyExistingUserByEmail(email);

    await this.authService.verifyTokenId(newAccess_token, user.id);

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      throw new HttpException(
        'A senha digitada está incorreta',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (
      (newEmail === email && newPassword === password) ||
      (!newEmail && !newPassword) ||
      (newEmail === email && !newPassword) ||
      (newPassword === password && !newEmail)
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    let editedUser: { id: UUID; email: string; password: string };

    if (!newEmail && newPassword) {
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      editedUser = {
        id: user.id,
        email: user.email,
        password: hashedNewPassword,
      };
    } else if (!newPassword && newEmail) {
      editedUser = {
        id: user.id,
        email: newEmail,
        password: user.password,
      };
    } else {
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      editedUser = {
        id: user.id,
        email: newEmail,
        password: hashedNewPassword,
      };
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

  async deleteUser({ access_token, refresh_token, id }: DeleteUserDTO) {
    const { newAccess_token } = await this.authService.getNewTokens(
      access_token,
      refresh_token,
    );

    const user = await this.userRepository.verifyExistingUserById(id);

    await this.authService.verifyTokenId(newAccess_token, id);

    await this.userRepository.deleteUser(id, user?.email);

    return {
      message: 'Usuario deletado com sucesso!',
    };
  }
}
