import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartRepository } from './repository/cart.repository';
import { UUID } from 'crypto';
import { Product } from '../Product/entity/product.entity';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../User/repository/user.repository';
import { ProductRepository } from '../Product/repository/product.repository';
import { User } from '../User/entity/user.entity';
import { CartProduct } from './entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private authService: AuthService,
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
  ) {}

  async createCart(userId: UUID) {
    return await this.cartRepository.create(userId);
  }

  async getCart() {}

  async getSubtotal() {}

  async addCartProduct(
    access_token: string,
    productId: UUID,
    quantity?: number,
  ) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const userId = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(userId);

    await this.authService.verifyTokenId(access_token, user.id);

    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(userId)).products;

    const alreadyAddedIndex = cartProducts.findIndex(
      (product) => product.productId === productId,
    );

    if (alreadyAddedIndex) {
      quantity
        ? (cartProducts[alreadyAddedIndex].quantity =
            cartProducts[alreadyAddedIndex].quantity + quantity)
        : (cartProducts[alreadyAddedIndex].quantity =
            cartProducts[alreadyAddedIndex].quantity + 1);

      await this.cartRepository.update(userId, cartProducts);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(userId),
      };
    } else {
      const product = quantity
        ? new CartProduct(productId, quantity)
        : new CartProduct(productId, 1);

      const products = [...cartProducts, product];

      await this.cartRepository.update(userId, products);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(userId),
      };
    }
  }

  async decrementProduct(
    access_token: string,
    productId: UUID,
    quantity?: number,
  ) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const userId = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(userId);

    await this.authService.verifyTokenId(access_token, user.id);

    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(userId)).products;

    const isAddedIndex = cartProducts.findIndex(
      (product) => product.productId === productId,
    );

    if (!isAddedIndex) {
      throw new HttpException(
        `O produto com id ${productId} não está adicionado no carrino`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      quantity
        ? (cartProducts[isAddedIndex].quantity =
            cartProducts[isAddedIndex].quantity - quantity)
        : (cartProducts[isAddedIndex].quantity =
            cartProducts[isAddedIndex].quantity - 1);

      await this.cartRepository.update(userId, cartProducts);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(userId),
      };
    }
  }

  async removeProduct(access_token: string, productId: UUID) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const userId = await this.authService.getTokenId(newAccess_token);

    const user = await this.userRepository.verifyExistingUserById(userId);

    await this.authService.verifyTokenId(access_token, user.id);

    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(userId)).products;

    const isAdded = cartProducts.find(
      (product) => product.productId === productId,
    );

    if (!isAdded) {
      throw new HttpException(
        `O produto com id ${productId} não está adicionado no carrino`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const filteredCart = cartProducts.filter((product) => product.productId !== productId);

      await this.cartRepository.update(userId, filteredCart);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(userId),
      };
    }
  }

  async clearCart(access_token: string) {}
}
