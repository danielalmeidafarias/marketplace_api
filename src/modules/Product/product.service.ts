import { Injectable } from '@nestjs/common';
import { IProduct } from '../../interfaces/IProduct';
import { IUser } from 'src/interfaces/IUser';

@Injectable()
export class ProductService {
  async createProduct(
    produto: IProduct,
    { access_token, refresh_token }: IUser,
  ) {
    // Logica para criar produto
    return {
      message: 'Produto criado com sucesso!',
      produto,
    };
  }

  async getProduct({ id }: IProduct) {
    // Logica para acessar o produto
    return {
      id,
      produto: 'Dados do produto',
    };
  }

  async editProduct(
    { id }: IProduct,
    editedProduct: IProduct,
    { access_token, refresh_token }: IUser,
  ) {
    // Logica para editar produto no banco de dados
    return {
      message: 'Produto editado com sucesso',
      editedProduct,
    };
  }

  async deleteProduct(
    { id }: IProduct,
    { access_token, refresh_token }: IUser,
  ) {
    // Logica para deletar o produto
    return {
      message: `Produto ${id} excluido com sucesso`,
    };
  }
}
