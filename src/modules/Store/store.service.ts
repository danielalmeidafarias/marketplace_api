import { Injectable } from '@nestjs/common';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreRepository } from './repository/store.repository';

@Injectable()
export class StoreService {
  constructor(private storeRepository: StoreRepository) {}
  // criacao de loja
  async createStore({ name, cpf,cpnj, cep, phone, userId }: CreateStoreDTO) {
    // Verificacao cnpj
    // Se nao tiver cnpj utilizar o cpf do usuário

    // Verificacao email
    // Se nao tiver utilizar o email do usuario

    // Verificacao conta realmente existe
    // Verificacao se o access_token  e o id condizem

    await this.storeRepository.verifyExistingStore(name)

    return this.storeRepository.create(name, cpf,cpnj, cep, phone, userId)

  }

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
