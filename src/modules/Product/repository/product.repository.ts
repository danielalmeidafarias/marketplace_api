import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async findById(id: UUID) {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      const product = await queryRunner.manager.findOneBy(Product, { id });
      return product;
    } catch {
      throw new HttpException(
        'Ocorreu um erro, por favor tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(userId: UUID) {
    const entityManager = this.dataSource.createEntityManager();

    try {
      const product = await entityManager.findBy(Product, { userId });
      return product;
    } catch {
      throw new HttpException(
        'Ocorreu um erro, por favor tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByName(name: string, userId: UUID) {
    const entityManager = this.dataSource.createEntityManager();

    const product = await entityManager.findOneBy(Product, {
      name,
      userId,
    });

    return product;
  }

  async createProduct(
    userId: UUID,
    name: string,
    price: number,
    quantity?: number,
  ) {
    try {
      const product = new Product(name, userId, price, quantity);

      this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(product)
        .execute();

      return product;
    } catch {
      throw new HttpException(
        'Algum erro ocorreu ao tentar criar o produto, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editProduct(
    id: UUID,
    userId: UUID,
    newName: string,
    newPrice: number,
    quantity: number,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      queryBuilder
        .update(Product)
        .set({ name: newName, price: newPrice, quantity: quantity })
        .where('id = :id', { id })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch (err) {
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar o produto, tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: UUID) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      await queryBuilder
        .delete()
        .from(Product)
        .where('id = :id', { id: id })
        // .andWhere('userId = :userId', { userId: userId })
        .execute();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar excluir o produto, tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyExistingProduct(name: string, userId: UUID) {
    const alreadyAdded = await this.findOneByName(name, userId);

    if (alreadyAdded) {
      throw new HttpException(
        'Um produto com mesmo nome já foi adicionado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
