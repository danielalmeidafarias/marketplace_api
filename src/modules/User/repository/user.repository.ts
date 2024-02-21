import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findUserById(id: UUID): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  async findUserByCPF(cpf: string): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.cpf = :cpf', { cpf })
      .getOne();

    return user;
  }

  async findUserByPhone(phone: string): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.phone = :phone', { phone })
      .getOne();

    return user;
  }

  async createUser(user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao criar o usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      queryRunner.release();
    }
  }

  async editUser(
    id: UUID,
    newEmail?: string,
    newPassword?: string,
    newName?: string,
    newLastName?: string,
    newCEP?: string,
    newLogradouro?: string,
    newBairro?: string,
    newCidade?: string,
    newUf?: string,
    newPhone?: string,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      queryBuilder
        .update(User)
        .set({
          email: newEmail,
          password: newPassword,
          name: newName,
          lastName: newLastName,
          cep: newCEP,
          logradouro: newLogradouro,
          bairro: newBairro,
          cidade: newCidade,
          uf: newUf,
          phone: newPhone,
        })
        .where('id = :id', { id: id })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: UUID) {
    try {
      await this.dataSource
        .getRepository(User)
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar deletar o usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyExistingUserById(id: UUID) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpException(
        `O id ${id} não corresponde a nenhum usuário`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async verifyExistingUserByEmail(email: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        `O email ${email} não corresponde a nenhum usuário`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async verifyExistingUserByCPF(cpf: string) {
    const user = await this.findUserByCPF(cpf);

    if (!user) {
      throw new HttpException(
        `O cpf ${cpf} não corresponde a nenhum usuário`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoUserWithEmail(email: string) {
    const user = await this.findUserByEmail(email);

    if (user) {
      throw new HttpException(
        `Já existe um usuário registrado com o email ${email}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoUserWithCPF(cpf: string) {
    const user = await this.findUserByCPF(cpf);

    if (user) {
      throw new HttpException(
        `Já existe um usuário registrado com o cpf ${cpf}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoUserWithPhone(phone: string) {
    const user = await this.findUserByPhone(phone);

    if (user) {
      throw new HttpException(
        `Já existe um usuário registrado com o phone ${phone}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserInfo(id: UUID) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      const user = await queryBuilder
        .select('user')
        .from(User, 'user')
        .where('id = :id', { id: id })
        .getOne();
      return user;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar encontrar o usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
