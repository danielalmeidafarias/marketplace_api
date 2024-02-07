import { UserRepository } from './repository/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '../../interfaces/IUser';
import { DataSource, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async createUser({ email, password }: IUser) {
    const alreadyUser = await this.userRepository.findUserByEmail(email);

    if (alreadyUser) {
      throw new HttpException(
        `O email ${email} já possui uma conta registrada`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User(email, hashedPassword);

    try {
      await this.userRepository.createUser(user);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.authService.signIn(user);
  }

  async loginUser({ email, password }: IUser) {
    const alreadyUser = await this.userRepository.findUserByEmail(email);

    if (!alreadyUser) {
      throw new HttpException(
        `Não há nenhuma conta registrada com o email ${email}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordIsCorrect = await bcrypt.compare(
      password,
      alreadyUser.password,
    );

    if (!passwordIsCorrect) {
      throw new HttpException(
        'A senha digitada está incorreta',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authService.signIn(alreadyUser);
  }

  async getUser({ id }: IUser) {
    return {
      id: id,
    };
  }

  async editUser({ access_token, refresh_token, email, password }: IUser) {
    // Logica de modificar usuario no banco de dados
    // Retornar usuario modificado
    return {
      message: 'Usuario editado com sucesso!',
    };
  }

  async deleteUser({ access_token, refresh_token }: IUser) {
    // Logica para deletar o usuario do banco de dados
    return {
      message: 'Usuario deletado com sucesso!',
    };
  }
}
