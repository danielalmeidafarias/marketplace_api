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
import { CreateProductDTO } from './dto/create-product.dto';
import { UserRepository } from '../User/repository/user.repository';
import { UUID } from 'crypto';
import { EditProductDto } from './dto/edit-product.dto';
import { DeleteProductDTO } from './dto/delete-product.dto';
import { SearchProductDTO } from './dto/search-product.dto';
import { CreateUserStoreProduct } from '../User/dto/create-user-store-product.dto';
import { EditUserProductDto } from '../User/dto/edit-user-store-product.dto';
import { DeleteUserStoreProductDTO } from '../User/dto/delete-user-store-product.dto';

@Injectable()
@UseGuards(AuthGuard)
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private authService: AuthService,
    private userRepository: UserRepository,
    private storeRepository: StoreRepository,
  ) {}

  async createProduct({
    name,
    price,
    quantity,
    access_token,
  }: CreateProductDTO) {
    const id = await this.authService.getTokenId(access_token);

    await this.storeRepository.verifyExistingStoreById(id);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    name = name.toUpperCase()

    await this.productRepository.verifyThereIsNoProductWithNameAndStore(
      name,
      id,
    );

    const product = await this.productRepository.createProduct(
      id,
      name,
      price,
      quantity,
    );

    return {
      message: 'Produto criado com sucesso!',
      product,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async createUserStoreProduct({
    storeId,
    name,
    price,
    quantity,
    access_token,
  }: CreateUserStoreProduct) {
    const id = await this.authService.getTokenId(access_token);

    await this.userRepository.verifyExistingUserById(id);

    await this.storeRepository.verifyExistingStoreById(storeId);

    await this.storeRepository.verifyExistingStoreInUser(id, storeId);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    name = name.toUpperCase()

    await this.productRepository.verifyThereIsNoProductWithNameAndStore(
      name,
      storeId,
    );

    const product = await this.productRepository.createProduct(
      id,
      name,
      price,
      quantity,
    );

    return {
      message: 'Produto criado com sucesso!',
      product,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async editProduct({
    access_token,
    id,
    newName,
    newPrice,
    newQuantity,
  }: EditProductDto) {
    const product = await this.productRepository.verifyExistingProductById(id);

    const storeId = await this.authService.getTokenId(access_token);

    await this.storeRepository.verifyExistingStoreById(storeId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      id,
      storeId,
    );

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    if (newName) {
      newName = newName.toUpperCase()
      await this.productRepository.verifyThereIsNoProductWithNameAndStore(
        newName,
        storeId,
      );
    }

    const editedProduct = {
      id: id,
      name: newName ? newName : product.name,
      price: newPrice ? newPrice : product.price,
      quantity: newQuantity ? newQuantity : product.quantity,
    };

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

    await this.productRepository.editProduct(
      id,
      editedProduct.name,
      editedProduct.price,
      editedProduct.quantity,
    );

    return {
      message: `Produto ${id} editado com sucesso!`,
      product: editedProduct,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async editUserStoreProduct({
    access_token,
    storeId,
    id,
    newName,
    newPrice,
    newQuantity,
  }: EditUserProductDto) {
    const product = await this.productRepository.verifyExistingProductById(id);

    const userId = await this.authService.getTokenId(access_token);

    await this.userRepository.verifyExistingUserById(userId);

    await this.storeRepository.verifyExistingStoreById(id);

    await this.storeRepository.verifyExistingStoreInUser(id, storeId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      id,
      storeId,
    );

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    if (newName) {
      newName = newName.toUpperCase()
      await this.productRepository.verifyThereIsNoProductWithNameAndStore(
        newName,
        storeId,
      );
    }

    const editedProduct = {
      id: id,
      name: newName ? newName : product.name,
      price: newPrice ? newPrice : product.price,
      quantity: newQuantity ? newQuantity : product.quantity,
    };

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

    await this.productRepository.editProduct(
      id,
      editedProduct.name,
      editedProduct.price,
      editedProduct.quantity,
    );

    return {
      message: `Produto ${id} editado com sucesso!`,
      product: editedProduct,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteProduct({ id, access_token }: DeleteProductDTO) {
    const product = await this.productRepository.verifyExistingProductById(id);

    const storeId = await this.authService.getTokenId(access_token);

    await this.storeRepository.verifyExistingStoreById(storeId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      id,
      storeId,
    );

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    await this.productRepository.deleteProduct(id);

    return {
      message: `Produto ${id} excluido com sucesso`,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async deleteUserStorProduct({ id, access_token, storeId }: DeleteUserStoreProductDTO) {
    const product = await this.productRepository.verifyExistingProductById(id);

    const userId = await this.authService.getTokenId(access_token);

    await this.userRepository.verifyExistingUserById(userId);

    await this.storeRepository.verifyExistingStoreById(id);

    await this.storeRepository.verifyExistingStoreInUser(id, storeId);

    await this.productRepository.verifyExistingProductInStoreWithId(
      id,
      storeId,
    );

    await this.productRepository.deleteProduct(id);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);
  }
}
