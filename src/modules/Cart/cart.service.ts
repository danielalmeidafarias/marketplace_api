import {
  BeforeApplicationShutdown,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CartRepository } from './repository/cart.repository';
import { UUID } from 'crypto';
import { AuthService } from '../auth/auth.service';
import { ProductRepository } from '../Product/repository/product.repository';
import { Cart, CartProduct } from './entity/cart.entity';
import { UtilsService } from '../utils/utils.service';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PagarmeService } from '../Pagarme/pagarme.service';
import { SplitObject } from '../Pagarme/classes/Order';

@Injectable()
export class CartService implements BeforeApplicationShutdown {
  constructor(
    private cartRepository: CartRepository,
    private authService: AuthService,
    private productRepository: ProductRepository,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry,
    private pagarmeService: PagarmeService,
  ) {}

  async beforeApplicationShutdown() {
    await this.cartRepository.clearAllCarts();
  }

  async addCartProduct(
    access_token: string,
    refresh_token: string,
    productId: UUID,
    quantity?: number,
  ) {
    await this.verifyProductIsAvailable(productId, quantity);

    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    const product =
      await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(account.id))
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

      await this.addCartCron(account.id);

      await this.cartRepository.update(account.id, cartProducts);

      await this.productRepository.addProductToCart(productId, quantity);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(account.id),
      };
    } else {
      const newCartProduct = quantity
        ? new CartProduct(
            productId,
            product.recipient_id,
            quantity,
            product.price,
            product.description,
          )
        : new CartProduct(
            productId,
            product.recipient_id,
            1,
            product.price,
            product.description,
          );

      const products = [...cartProducts, newCartProduct];

      await this.cartRepository.update(account.id, products);

      await this.productRepository.addProductToCart(productId, quantity);

      await this.addCartCron(account.id);

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(account.id),
      };
    }
  }

  async decrementProduct(
    access_token: string,
    refresh_token: string,
    productId: UUID,
    quantity?: number,
  ) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);
    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(account.id))
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
          account.id,
          cartProducts,
        );
      } else {
        quantity
          ? (cartProducts[isAddedIndex].quantity =
              cartProducts[isAddedIndex].quantity - quantity)
          : (cartProducts[isAddedIndex].quantity =
              cartProducts[isAddedIndex].quantity - 1);

        await this.addCartCron(account.id);

        await this.cartRepository.update(account.id, cartProducts);

        await this.productRepository.decrementProductFromCart(
          productId,
          quantity,
        );
      }

      return {
        access_token: newAccess_token,
        refresh_token: newRefresh_token,
        cart: await this.cartRepository.getCart(account.id),
      };
    }
  }

  async removeProduct(access_token: string, refresh_token, productId: UUID) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    await this.productRepository.verifyExistingProductById(productId);

    await this.productRepository.verifyExistingProductById(productId);

    const cartProducts = (await this.cartRepository.getCart(account.id))
      .products;

    if (cartProducts.length < 1) {
      throw new HttpException(
        'O carrinho já está vazio',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.removeProductFromDatabase(productId, account.id, cartProducts);

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      cart: await this.cartRepository.getCart(account.id),
    };
  }

  async clearCart(access_token: string, refresh_token: string) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    await this.cartRepository.update(account.id, []);

    this.schedulerRegistry.deleteCronJob(account.id);

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      cart: await this.cartRepository.getCart(account.id),
    };
  }

  async creditCardOrder(
    access_token: string,
    refresh_token: string,
    installments: number,
    card_id: string,
    cvv: string,
  ) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    const { cart, subtotal } = await this.getCart(account.id);

    const { split } = await this.getSplitArray(cart);

    const { orderId } = await this.pagarmeService.creditCardOrder(
      account.costumerId,
      split,
      cart.products,
      installments,
      card_id,
      cvv,
    );

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      orderId,
      subtotal,
    };
  }

  async PixOrder(access_token: string, refresh_token: string) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    const { cart, subtotal } = await this.getCart(account.id);

    const { split } = await this.getSplitArray(cart);

    const { orderId } = await this.pagarmeService.pixOrder(
      account.costumerId,
      split,
      cart.products,
    );

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      orderId,
      subtotal,
    };
  }

  private async getCart(accountId: UUID) {
    const cart = await this.cartRepository.getCart(accountId);

    if (cart.products.length > 0) {
      const subtotal = Array.from(cart.products, (product) => {
        return product.amount * product.quantity;
      }).reduce((acc, cv) => {
        return acc + cv;
      });

      return {
        cart,
        subtotal,
      };
    } else {
      throw new HttpException('O carrinho está vazio', HttpStatus.BAD_REQUEST);
    }
  }

  private async getSplitArray(cart: Cart) {
    const split = Array.from(cart.products, (product) => {
      return new SplitObject(
        product.amount * product.quantity,
        product.recipientId,
      );
    });

    return { split };
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
