import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/IUser';

@Injectable()
export class UserService {
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

  async getUser({ access_token, refresh_token }: IUser) {
    // Logica para devolver dados do usuario do banco
    return {
      id: 'Id usuário',
      email: 'Email usuário'
    };
  }

  async editUser({ access_token, refresh_token, email, password }: IUser) {
    // Logica de modificar usuario no banco de dados
    // Retornar usuario modificado
    console.log(access_token)
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
