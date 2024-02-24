import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UUID } from 'crypto';

export interface ICreateProduct {
  storeId: UUID
  name: string,
  price: number,
  quantity: number
  userId?: UUID
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) { }

  async createProduct(
    { storeId,
      name,
      price,
      quantity,
      userId
    }: ICreateProduct
  ) {
    try {
      this.dataSource
        .getRepository(Product)
        .createQueryBuilder()
        .insert()
        .values({
          name,
          price,
          quantity,
          available: quantity,
          storeId,
          userId: userId ? userId : null,
        })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Algum erro ocorreu ao tentar criar o produto, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editProduct(id: UUID, name: string, price: number, quantity: number) {
    try {
      await this.dataSource
        .getRepository(Product)
        .createQueryBuilder()
        .update(Product)
        .set({ name, price, quantity: quantity })
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar o produto, tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: UUID) {
    try {
      await this.dataSource
        .getRepository(Product)
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar excluir o produto, tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async findOneById(id: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('id = :id', { id })
      .getOne();
  }

  private async findOneInStoreById(productId: UUID, storeId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('id = :id', { id: productId })
      .andWhere('product.storeId = :storeId', { storeId })
      .getOne();
  }

  private async findManyByStoreId(storeId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('storeId = :storeId', { storeId })
      .getMany();
  }

  private async findManyByUserId(userId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('userId = :userId', { userId })
      .getMany();
  }

  private async findManyByName(name: string) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('name = :name', { name })
      .getMany();
  }

  private async findOneByNameAndStore(name: string, storeId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.storeId = :storeId', { storeId })
      .andWhere('name = :name', { name })
      .getOne();
  }

  async verifyExistingProductById(
    id: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const product = await this.findOneById(id);

    if (!product) {
      throw new HttpException(
        message ? message : `Não há nenhum produto registrada com o id ${id}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return product;
  }

  async verifyExistingProductInStoreWithId(
    id: UUID,
    storeId: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const product = await this.findOneInStoreById(id, storeId);

    if (!product) {
      throw new HttpException(
        message
          ? message
          : `Não há nenhum produto registrada com o id ${id} na loja ${storeId}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return product;
  }

  async verifyExistingProductByNameAndStoreId(
    name: string,
    storeId: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const product = await this.findOneByNameAndStore(name, storeId);

    if (!product) {
      throw new HttpException(
        message
          ? message
          : `Não há nenhum produto registrada com o nome ${name}, na loja ${storeId}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return product;
  }

  async verifyThereIsNoProductWithNameAndStore(name: string, storeId: UUID) {
    const store = await this.findOneByNameAndStore(name, storeId);

    if (store) {
      throw new HttpException(
        'Já existe um produto registrado nessa loja com esse nome',
        HttpStatus.CONFLICT,
      );
    }
  }

  async searchProduct(name: string) {
    name = name.toUpperCase();

    try {
      const products = await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .where('product.name like :name', { name: `%${name}%` })
        .getMany();

      if (!products[0]) {
        return {
          message: 'Não foi encontrado nenhum produto',
        };
      }

      return products;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro, por favor tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
