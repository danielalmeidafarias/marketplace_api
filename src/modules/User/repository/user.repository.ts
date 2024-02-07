import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { IUser } from 'src/interfaces/IUser';
import { HttpException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Product } from 'src/modules/Product/entity/product.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findUserById(id: UUID): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const user = await queryRunner.manager.findOneBy(User, { id });
    if (user) {
      return true;
    }
    return false;
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
      throw new Error(err.message);
    } finally {
      queryRunner.release();
    }
  }

  async editUser() {
    try {
    } catch (err) {
    } finally {
    }
  }

  async deleteUser() {
    try {
    } catch (err) {
    } finally {
    }
  }

  async getUserProducts() {}
}
