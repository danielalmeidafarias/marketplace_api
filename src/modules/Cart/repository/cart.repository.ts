import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cart, CartProduct } from '../entity/cart.entity';
import { Product } from 'src/modules/Product/entity/product.entity';
import { UUID } from 'crypto';
import { User } from 'src/modules/User/entity/user.entity';

@Injectable()
export class CartRepository {
  constructor(private dataSource: DataSource) {}
  async create(userId: UUID) {
    try {
      const cart = await this.dataSource
        .getRepository(Cart)
        .createQueryBuilder()
        .insert()
        .values({ userId })
        .execute();
      return { cartId: cart.identifiers[0].id };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao criar o carrinho',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCart(userId: UUID) {
    try {
      const cart = await this.dataSource
        .getRepository(Cart)
        .createQueryBuilder('cart')
        .where('cart.userId = :userId', { userId })
        .getOne();
      return cart;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        `Não foi encontrado nenhum carrinho com o id ${userId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(userId: UUID, products: CartProduct[]) {
    try {
      await this.dataSource
        .getRepository(Cart)
        .createQueryBuilder()
        .where('userId = :userId', { userId })
        .update({
          products: products,
        })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar adicionar o produto ao carrinho',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(userId: UUID) {
    try {
      await this.dataSource
        .getRepository(Cart)
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar excluir o carrinho, tente novamete mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async clearAllCarts() {
    await this.dataSource
      .getRepository(Cart)
      .createQueryBuilder()
      .update({
        products: [],
      })
      .execute();
  }
}
