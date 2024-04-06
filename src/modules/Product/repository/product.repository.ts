import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product, UserStoreProduct } from '../entity/product.entity';
import { DataSource } from 'typeorm';
import { UUID } from 'crypto';

export interface ICreateProduct {
  storeId: UUID;
  name: string;
  price: number;
  quantity: number;
  userId?: UUID;
}

@Injectable()
export class ProductRepository {
  constructor(private dataSource: DataSource) {}

  async turnProductStockToAvailable() {
    const allProducts = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('products')
      .getMany();
    allProducts.forEach(async (product) => {
      await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .update({
          available: product.quantity,
        })
        .execute();
    });
  }

  async createProduct(product: Product | UserStoreProduct) {
    try {
      this.dataSource
        .getRepository(Product)
        .createQueryBuilder()
        .insert()
        .values({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          available: product.quantity,
          storeId: product.storeId,
          recipient_id: product.recipient_id,
          userId: product.userId,
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

  async updateProduct(product: Product | UserStoreProduct) {
    try {
      await this.dataSource
        .getRepository(Product)
        .createQueryBuilder()
        .update(Product)
        .set({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          available: product.quantity,
        })
        .where('id = :id', { id: product.id })
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

  async deleteStoreProducts(id: UUID) {
    try {
      const products = await this.findManyByStoreId(id);

      products.forEach(async (product) => {
        await this.deleteProduct(product.id);
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar excluir os produtos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserProducts(id: UUID) {
    try {
      const products = await this.findManyByUserId(id);

      if (products.length > 0) {
        products.forEach(async (product) => {
          await this.deleteProduct(product.id);
        });
      }
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar excluir os produtos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneById(id: UUID) {
    try {
      return await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .where('id = :id', { id })
        .getOne();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        `Não foi encontrado nenhm produto com o id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneInStoreById(productId: UUID, storeId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('id = :id', { id: productId })
      .andWhere('product.storeId = :storeId', { storeId })
      .getOne();
  }

  async findManyByStoreId(storeId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.storeId = :storeId', { storeId })
      .getMany();
  }

  async findManyByUserId(userId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.userId = :userId', { userId })
      .getMany();
  }

  async searchManyByName(name: string) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('name ~* :name', { name })
      .getMany();
  }

  async searchManyByNameAndStore(name: string, storeId: UUID) {
    return await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('name ~* :name', { name })
      .andWhere('product.storeId = :storeId', { storeId })
      .getMany();
  }

  async findOneByNameAndStore(name: string, storeId: UUID) {
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

  async addProductToCart(id: UUID, quantity?: number) {
    try {
      await this.dataSource
        .getRepository(Product)
        .createQueryBuilder()
        .where('id = :id', { id })
        .update(Product)
        .set({
          available: quantity
            ? () => `available - ${quantity}`
            : () => `available - 1`,
        })
        .execute();
    } catch (err) {
      console.error(err);
    }
  }

  async decrementProductFromCart(id: UUID, quantity?: number) {
    try {
      await this.dataSource
        .getRepository(Product)
        .createQueryBuilder()
        .where('id = :id', { id })
        .update(Product)
        .set({
          available: quantity
            ? () => `available + ${quantity}`
            : () => `available + 1`,
        })
        .execute();
    } catch (err) {
      console.error(err);
    }
  }
}
