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

  async findUserById(id: UUID): Promise<User | undefined> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const user = await queryRunner.manager.findOneBy(User, { id });

    return user;
  }

  async findUserByEmail(email: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const user = await queryRunner.manager.findOneBy(User, { email });

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
      throw new HttpException(
        {
          message:
            'Ocorreu um erro ao criar o usuário, tente novamente mais tarde',
          err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      queryRunner.release();
    }
  }

  async editUser(id: UUID, newEmail?: string, newPassword?: string) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      queryBuilder
        .update(User)
        .set({ email: newEmail, password: newPassword })
        .where('id = :id', { id: id })
        .execute();
    } catch (err) {
      throw new HttpException(
        {
          message:
            'Ocorreu um erro ao tentar atualizar usuário, tente novamente mais tarde',
          err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: UUID, email: string) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      await queryBuilder
        .delete()
        .from(User)
        .where('id = :id', { id: id })
        .andWhere('email = :email', { email: email })
        .execute();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          message:
            'Ocorreu um erro ao tentar deletar o usuário, tente novamente mais tarde',
          err,
        },
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

  async getUserInfo(id: UUID) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      const user = await queryBuilder
        .select('user')
        .from(User, 'user')
        .where('id = :id', { id: id })
        .getOne();
      return user;
    } catch (err){
      throw new HttpException(
        {
          messaage:
            'Ocorreu um erro ao tentar encontrar o usuário, tente novamente mais tarde',
          err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
