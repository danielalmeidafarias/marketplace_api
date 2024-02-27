import { StoreRepository } from './../Store/repository/store.repository';
import { AuthService } from './../auth/auth.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { AuthGuard } from '../auth/auth.guard';
import { UserRepository } from '../User/repository/user.repository';
import { UUID } from 'crypto';
import { Product, UserStoreProduct } from './entity/product.entity';

export interface ICreateProduct {
  name: string;
  description: string
  price: number;
  quantity: number;
  access_token: string;
  refresh_token: string;
  storeId?: UUID;
}

export interface IUpdateProduct {
  access_token: string;
  refresh_token: string;
  productId: UUID;
  newName?: string;
  newDescription: string
  newPrice?: number;
  newQuantity?: number;
  storeId?: UUID;
}

export interface IDeleteProduct {
  productId: UUID;
  access_token: string;
  refresh_token: string;
  storeId?: UUID;
}

@Injectable()
@UseGuards(AuthGuard)
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private authService: AuthService,
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
  ) {}

  async createProduct({ name: incomingName, description ,price, quantity, access_token }: ICreateProduct) {
    const storeId = await this.authService.getTokenId(access_token);

    const store = await this.storeRepository.verifyExistingStoreById(storeId);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const name = incomingName.toUpperCase();

    await this.productRepository.verifyThereIsNoProductWithNameAndStore(
      name,
      storeId,
    );

    const product = new Product(storeId, store, name, description, price, quantity);

    await this.productRepository.createProduct(product);

    return {
      message: 'Produto criado com sucesso!',
      product,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async createUserStoreProduct({
    storeId,
    name: incomingName,
    description,
    price,
    quantity,
    access_token,
  }: ICreateProduct) {
    const userId = await this.authService.getTokenId(access_token);

    const user = await this.userRepository.verifyExistingUserById(userId);

    const store = await this.storeRepository.verifyExistingStoreById(storeId);

    await this.storeRepository.verifyExistingStoreInUser(userId, storeId);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const name = incomingName.toUpperCase();

    await this.productRepository.verifyThereIsNoProductWithNameAndStore(
      name,
      storeId,
    );

    const product = new UserStoreProduct(
      storeId,
      store,
      userId,
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
    productId,
    newName,
    newDescription,
    newPrice,
    newQuantity,
  }: IUpdateProduct) {
    const product =
      await this.productRepository.verifyExistingProductById(productId);

    const storeId = await this.authService.getTokenId(access_token);

    const store = await this.storeRepository.verifyExistingStoreById(storeId);

    const name = newName ? newName.toUpperCase() : null

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      storeId,
    );

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    if (newName && name !== product.name) {
      await this.productRepository.verifyThereIsNoProductWithNameAndStore(
        name,
        storeId,
      );
    }

    const editedProduct = new Product(
      storeId,
      store,
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
    storeId,
    productId,
    newName,
    newDescription,
    newPrice,
    newQuantity,
  }: IUpdateProduct) {
    const product =
      await this.productRepository.verifyExistingProductById(productId);

    const userId = await this.authService.getTokenId(access_token);

    const user = await this.userRepository.verifyExistingUserById(userId);

    const store = await this.storeRepository.verifyExistingStoreById(storeId);

    const name = newName ? newName.toUpperCase() : null

    await this.storeRepository.verifyExistingStoreInUser(userId, storeId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      storeId,
    );

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    if (newName && name !== product.name) {
      await this.productRepository.verifyThereIsNoProductWithNameAndStore(
        name,
        storeId,
      );
    }

    const editedProduct = new UserStoreProduct(
      storeId,
      store,
      userId,
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

  async deleteProduct({ productId, access_token }: IDeleteProduct) {
    await this.productRepository.verifyExistingProductById(productId);

    const storeId = await this.authService.getTokenId(access_token);

    await this.storeRepository.verifyExistingStoreById(storeId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      storeId,
    );

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

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
    storeId,
  }: IDeleteProduct) {
    await this.productRepository.verifyExistingProductById(productId);

    const userId = await this.authService.getTokenId(access_token);

    await this.userRepository.verifyExistingUserById(userId);

    await this.storeRepository.verifyExistingStoreById(storeId);

    await this.storeRepository.verifyExistingStoreInUser(userId, storeId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      productId,
      storeId,
    );

    await this.productRepository.deleteProduct(productId);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    return {
      message: `Produto ${productId} excluido com sucesso`,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }
}
