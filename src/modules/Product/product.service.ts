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

@Injectable()
@UseGuards(AuthGuard)
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  async createProduct({
    userId,
    name,
    price,
    quantity,
    access_token,
  }: CreateProductDTO) {
    await this.userRepository.verifyExistingUserById(userId);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    await this.authService.verifyTokenId(newAccess_token, userId);

    await this.productRepository.verifyExistingProduct(name, userId);

    const product = await this.productRepository.createProduct(
      userId,
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

  async findByUserId(id: UUID) {
    await this.userRepository.verifyExistingUserById(id);

    const products = await this.productRepository.findByUserId(id);

    if (!products[0]) {
      return {
        message: 'Nenhum produto registrado com o id fornecido',
      };
    }

    const filterdProducts = Array.from(products, (product) => {
      return {
        id: product.id,
        userId: product.userId,
        name: product.name,
        price: product.price,
      };
    });

    return filterdProducts;
  }

  async getProduct(id: UUID) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new HttpException(
        'O id fornecido não corresponde a nenhum produto registrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      id: product.id,
      userId: product.id,
      name: product.name,
      price: product.price,
    };
  }

  async editProduct({
    access_token,
    id,
    userId,
    newName,
    newPrice,
    newQuantity,
  }: EditProductDto) {
    await this.userRepository.verifyExistingUserById(userId);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    await this.authService.verifyTokenId(newAccess_token, userId);

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new HttpException(
        'O id fornecido não corresponde a nenhum produto regstrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const editedProduct = {
      id: id,
      userId: userId,
      name: newName ? newName : product.name,
      price: newPrice ? newPrice : product.price,
      quantity: newQuantity ? newQuantity : product.quantity,
    };

    if (product.name !== editedProduct.name) {
      await this.productRepository.verifyExistingProduct(newName, userId);
    }

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
      userId,
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

  async deleteProduct({ id, userId, access_token }: DeleteProductDTO) {
    await this.userRepository.verifyExistingUserById(userId);

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    await this.authService.verifyTokenId(newAccess_token, userId);

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new HttpException(
        'O id fornecido não corresponde a nenhum produto regstrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.productRepository.deleteProduct(id);

    return {
      message: `Produto ${id} excluido com sucesso`,
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
    };
  }

  async searchProduct({ name }: SearchProductDTO) {
    return this.productRepository.searchProduct(name);
  }
}
