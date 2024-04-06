import { StoreRepository } from './../Store/repository/store.repository';
import { AuthService } from './../auth/auth.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
  UseGuards,
} from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { AuthGuard } from '../auth/auth.guard';
import { UUID } from 'crypto';
import { Product, UserStoreProduct } from './entity/product.entity';

export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  access_token: string;
  refresh_token: string;
}

export interface IUpdateProduct {
  access_token: string;
  refresh_token: string;
  productId: UUID;
  newName?: string;
  newDescription: string;
  newPrice?: number;
  newQuantity?: number;
  storeId?: UUID;
}

export interface IDeleteProduct {
  productId: UUID;
  access_token: string;
  refresh_token: string;
}

@Injectable()
@UseGuards(AuthGuard)
export class ProductService implements OnApplicationBootstrap {
  constructor(
    private productRepository: ProductRepository,
    private authService: AuthService,
    private storeRepository: StoreRepository,
  ) {}

  async onApplicationBootstrap() {
    await this.productRepository.turnProductStockToAvailable();
  }

  async createProduct({
    name: incomingName,
    description,
    price,
    quantity,
    access_token,
    refresh_token,
  }: ICreateProduct) {
    const { store, newAccess_token, newRefresh_token } =
      await this.authService.storeVerification(access_token, refresh_token);

    const name = incomingName.toUpperCase();

    await this.productRepository.verifyThereIsNoProductWithNameAndStore(
      name,
      store.id,
    );

    const product = new Product(
      store.id,
      store.recipientId,
      name,
      description,
      price,
      quantity,
    );

    await this.productRepository.createProduct(product);

    return {
      message: 'Produto criado com sucesso!',
      product,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async createUserStoreProduct({
    name: incomingName,
    description,
    price,
    quantity,
    access_token,
    refresh_token,
  }: ICreateProduct) {
    const { user, newAccess_token, newRefresh_token } =
      await this.authService.userVerification(access_token, refresh_token);

    const store = await this.storeRepository.verifyExistingStoreByUserId(
      user.id,
    );

    const name = incomingName.toUpperCase();

    await this.productRepository.verifyThereIsNoProductWithNameAndStore(
      name,
      store.id,
    );

    const product = new UserStoreProduct(
      store.id,
      store.recipientId,
      user.id,
      user,
      name,
      description,
      price,
      quantity,
    );

    await this.productRepository.createProduct(product);

    return {
      message: 'Produto criado com sucesso!',
      product,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async updateProduct({
    access_token,
    refresh_token,
    productId,
    newName,
    newDescription,
    newPrice,
    newQuantity,
  }: IUpdateProduct) {
    const { store, newAccess_token, newRefresh_token } =
      await this.authService.storeVerification(access_token, refresh_token);

    const product =
      await this.productRepository.verifyExistingProductById(productId);

    const name = newName ? newName.toUpperCase() : null;

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      store.id,
    );

    if (newName && name !== product.name) {
      await this.productRepository.verifyThereIsNoProductWithNameAndStore(
        name,
        store.id,
      );
    }

    const editedProduct = new Product(
      store.id,
      store.recipientId,
      newName ? name : product.name,
      newDescription ? newDescription : product.description,
      newPrice ? newPrice : product.price,
      newQuantity ? newQuantity : product.quantity,
      productId,
    );

    if (
      editedProduct.name === product.name &&
      editedProduct.price === product.price &&
      editedProduct.quantity === product.quantity
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.productRepository.updateProduct(editedProduct);

    return {
      message: `Produto ${productId} editado com sucesso!`,
      product: editedProduct,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async updateUserStoreProduct({
    access_token,
    refresh_token,
    productId,
    newName,
    newDescription,
    newPrice,
    newQuantity,
  }: IUpdateProduct) {
    const { user, newAccess_token, newRefresh_token } =
      await this.authService.userVerification(access_token, refresh_token);

    const store = await this.storeRepository.verifyExistingStoreByUserId(
      user.id,
    );

    const product =
      await this.productRepository.verifyExistingProductById(productId);

    const name = newName ? newName.toUpperCase() : null;

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      store.id,
    );

    if (newName && name !== product.name) {
      await this.productRepository.verifyThereIsNoProductWithNameAndStore(
        name,
        store.id,
      );
    }

    const editedProduct = new UserStoreProduct(
      store.id,
      store.recipientId,
      user.id,
      user,
      newName ? name : product.name,
      newDescription ? newDescription : product.description,
      newPrice ? newPrice : product.price,
      newQuantity ? newQuantity : product.quantity,
      productId,
    );

    if (
      editedProduct.name === product.name &&
      editedProduct.price === product.price &&
      editedProduct.quantity === product.quantity
    ) {
      throw new HttpException(
        'Nenhuma mudança foi requerida',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.productRepository.updateProduct(editedProduct);

    return {
      message: `Produto ${productId} editado com sucesso!`,
      product: editedProduct,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteProduct({
    productId,
    access_token,
    refresh_token,
  }: IDeleteProduct) {
    const { store, newAccess_token, newRefresh_token } =
      await this.authService.storeVerification(access_token, refresh_token);

    await this.productRepository.verifyExistingProductById(productId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      store.id,
    );

    await this.productRepository.deleteProduct(productId);

    return {
      message: `Produto ${productId} excluido com sucesso`,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteUserStoreProduct({
    productId,
    access_token,
    refresh_token,
  }: IDeleteProduct) {
    const { user, newAccess_token, newRefresh_token } =
      await this.authService.userVerification(access_token, refresh_token);

    const store = await this.storeRepository.verifyExistingStoreByUserId(
      user.id,
    );

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      store.id,
    );

    await this.productRepository.deleteProduct(productId);

    return {
      message: `Produto ${productId} excluido com sucesso`,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async searchProduct(name?: string, id?: UUID) {
    if (!name && !id) {
      throw new HttpException(
        'Pelo menos um dos parametros deve ser passado: name, id',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (id) {
      const product =
        await this.productRepository.verifyExistingProductById(id);
      const filteredPRoduct = {
        id: product.id,
        storeId: product.storeId,
        name: product.name,
        description: product.description,
        price: product.price,
      };
      return { product: filteredPRoduct };
    }

    const products = await this.productRepository.searchManyByName(name);

    const filteredProducts = Array.from(products, (product) => {
      return {
        id: product.id,
        storeId: product.storeId,
        name: product.name,
        description: product.description,
        price: product.price,
      };
    });

    return {
      products: filteredProducts,
    };
  }
}
