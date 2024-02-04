import { Injectable } from '@nestjs/common';
import { IUser } from '../../interfaces/IUser';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser({ email, password }: IUser) {
    // Logica para criacao de usuario
    return {
      message: 'Usuario criado com sucesso!',
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    };
  }

  async loginUser({ email, password }: IUser) {
    // Logica de login
    return {
      message: 'Login realizado com sucesso!',
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    };
  }

  async getUser({ id }: IUser) {
    // Logica para devolver dados do usuario do banco
    return {
      id: id,
      produtos: [],
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
