import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreService {
  // criacao de loja
  async createStore() {}

  // editar loja
  async editStore() {}

  // deletar loja
  async deleteStore() {}

  // encontrar lojas pelo nome
  async findStoreByName() {}

  // encontrar lojas pelo id da loja
  async findStoreById() {}

  // encontrar lojas pelo id do usuario
  async findStoreByUserId() {}

  // encontrar produtos da loja
  async searchStoreProducts() {
    // se tiver apenas o id da loja retornar todos produtos da loja
    // se tiver pesquisa retornar apenas o resultado da pesquisa
  }
}
