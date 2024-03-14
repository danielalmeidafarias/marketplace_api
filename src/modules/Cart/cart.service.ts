import {
  BeforeApplicationShutdown,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CartRepository } from './repository/cart.repository';
import { UUID } from 'crypto';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../User/repository/user.repository';
import { ProductRepository } from '../Product/repository/product.repository';
import { CartProduct } from './entity/cart.entity';
import { UtilsService } from '../utils/utils.service';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CartService implements BeforeApplicationShutdown {
  constructor(
    private cartRepository: CartRepository,
    private authService: AuthService,
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async beforeApplicationShutdown() {
    await this.cartRepository.clearAllCarts();
  }

  async createCart(userId: UUID) {
    return await this.cartRepository.create(userId);
  }

  async addCartProduct(
    access_token: string,
    productId: UUID,
    quantity?: number,
  ) {
    await this.verifyProductIsAvailable(productId, quantity);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const accountId = await this.authService.getTokenId(newAccess_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, account.id);

    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(accountId))
      .products;

    const alreadyAddedIndex = cartProducts.findIndex(
      (product) => product.productId === productId,
    );

    if (alreadyAddedIndex >= 0) {
      quantity
        ? (cartProducts[alreadyAddedIndex].quantity =
            cartProducts[alreadyAddedIndex].quantity + quantity)
        : (cartProducts[alreadyAddedIndex].quantity =
            cartProducts[alreadyAddedIndex].quantity + 1);

      await this.addCartCron(accountId);

      await this.cartRepository.update(accountId, cartProducts);

      await this.productRepository.addProductToCart(productId, quantity);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(accountId),
      };
    } else {
      const product = quantity
        ? new CartProduct(productId, quantity)
        : new CartProduct(productId, 1);

      const products = [...cartProducts, product];

      await this.cartRepository.update(accountId, products);

      await this.productRepository.addProductToCart(productId, quantity);

      await this.addCartCron(accountId);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(accountId),
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

    const accountId = await this.authService.getTokenId(newAccess_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, account.id);

    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(accountId))
      .products;

    if (cartProducts.length < 1) {
      throw new HttpException(
        'O carrinho já está vazio',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isAddedIndex = cartProducts.findIndex(
      (product) => product.productId === productId,
    );

    if (isAddedIndex < 0) {
      throw new HttpException(
        `O produto com id ${productId} não está adicionado no carrinho`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (
        quantity === cartProducts[isAddedIndex].quantity ||
        quantity > cartProducts[isAddedIndex].quantity
      ) {
        await this.removeProductFromDatabase(
          productId,
          accountId,
          cartProducts,
        );
      } else {
        quantity
          ? (cartProducts[isAddedIndex].quantity =
              cartProducts[isAddedIndex].quantity - quantity)
          : (cartProducts[isAddedIndex].quantity =
              cartProducts[isAddedIndex].quantity - 1);

        await this.addCartCron(accountId);

        await this.cartRepository.update(accountId, cartProducts);

        await this.productRepository.decrementProductFromCart(
          productId,
          quantity,
        );
      }

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(accountId),
      };
    }
  }

  async removeProduct(access_token: string, productId: UUID) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const accountId = await this.authService.getTokenId(newAccess_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, account.id);

    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(accountId))
      .products;

    if (cartProducts.length < 1) {
      throw new HttpException(
        'O carrinho já está vazio',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.removeProductFromDatabase(productId, accountId, cartProducts);

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      cart: await this.cartRepository.getCart(accountId),
    };
  }

  private async removeProductFromDatabase(
    productId: UUID,
    accountId: UUID,
    cartProducts: CartProduct[],
  ) {
    const isAdded = cartProducts.find(
      (product) => product.productId === productId,
    );

    if (!isAdded) {
      throw new HttpException(
        `O produto com id ${productId} não está adicionado no carrinho`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const filteredCart = cartProducts.filter(
        (product) => product.productId !== productId,
      );

      await this.addCartCron(accountId);

      await this.cartRepository.update(accountId, filteredCart);

      await this.productRepository.decrementProductFromCart(
        productId,
        isAdded.quantity,
      );
    }
  }

  async clearCart(access_token: string) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const accountId = await this.authService.getTokenId(newAccess_token);

    await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, accountId);

    await this.cartRepository.update(accountId, []);

    this.schedulerRegistry.deleteCronJob(accountId);

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      cart: await this.cartRepository.getCart(accountId),
    };
  }

  private async cronClearCart(accountId: UUID) {
    await this.utilsService.verifyExistingAccount(accountId);

    await this.cartRepository.update(accountId, []);

    this.schedulerRegistry.deleteCronJob(accountId);
  }

  private async addCartCron(accountId: UUID) {
    try {
      const cronJob = this.schedulerRegistry.getCronJob(accountId);

      if (cronJob) {
        this.schedulerRegistry.deleteCronJob(accountId);
      }

      const cron = new CronJob(CronExpression.EVERY_HOUR, async () => {
        await this.cronClearCart(accountId);
      });

      this.schedulerRegistry.addCronJob(accountId, cron);

      cron.start();
    } catch {
      const cron = new CronJob(CronExpression.EVERY_HOUR, async () => {
        await this.cronClearCart(accountId);
      });

      this.schedulerRegistry.addCronJob(accountId, cron);

      cron.start();
    }
  }

  private async verifyProductIsAvailable(productId: UUID, quantity?: number) {
    const product = await this.productRepository.findOneById(productId);
    if (product.available < 1 || quantity > product.available) {
      throw new HttpException('Quantidade indisponível', HttpStatus.CONFLICT);
    }
  }
}
