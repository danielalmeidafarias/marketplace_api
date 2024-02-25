import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Store, UserStore } from '../entity/store.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class StoreRepository {
  constructor(private dataSource: DataSource) {}

  async create(store: Store | UserStore) {
    try {
      await this.dataSource
        .getRepository(Store)
        .createQueryBuilder()
        .insert()
        .values({
          email: store.email,
          password: store.password,
          name: store.name,
          phone: store.phone,
          cnpj: store.cnpj,
          cpf: store.cpf,
          cep: store.cep,
          logradouro: store.logradouro,
          bairro: store.bairro,
          cidade: store.cidade,
          uf: store.uf,
          userId: store.userId,
        })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro durante a criacao da loja, por favor tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStoreInfo(id: UUID) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      const store = await queryBuilder
        .select('store')
        .from(Store, 'store')
        .where('store.id = :id', { id })
        .getOne();
      return store;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar encontrar a loja, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStoresInfoByUserId(userId: UUID) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      const stores = await queryBuilder
        .select('store')
        .from(Store, 'store')
        .where('store.userId = :userId', { userId })
        .getMany();
      return stores;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar encontrar a loja, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStore(store: Store | UserStore) {
    try {
      await this.dataSource
        .getRepository(Store)
        .createQueryBuilder()
        .update()
        .where('id = :id', { id: store.id })
        .set({
          name: store.name,
          email: store.email,
          phone: store.phone,
          password: store.password,
          cep: store.cep,
          logradouro: store.logradouro,
          bairro: store.bairro,
          cidade: store.cidade,
          uf: store.uf,
        })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro durante a edição da loja, por favor tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteStore(id: UUID) {
    try {
      await this.dataSource
        .getRepository(Store)
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar deletar a loja, por favor tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserStores(userId: UUID) {
    try {
      const userStores = await this.findManyByUserId(userId);

      userStores.forEach(async (store) => {
        await this.deleteStore(store.id);
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao excluir as lojas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async findManyByUserId(userId: UUID) {
    return await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.userId = :userId', { userId })
      .getMany();
  }

  private async findStoreByEmail(email: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.email = :email', { email })
      .getOne();

    return store;
  }

  private async findStoreByCnpj(cnpj: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.cnpj = :cnpj', { cnpj })
      .getOne();

    return store;
  }

  private async findStoreByPhone(phone: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.phone = :phone', { phone })
      .getOne();

    return store;
  }

  private async findStoreById(id: UUID) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('id = :id', { id })
      .getOne();

    return store;
  }

  private async findStoreByName(name: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.name = :name', { name })
      .getOne();

    return store;
  }

  private async findOneInUserById(userId: UUID, storeId: UUID) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('id = :id', { id: storeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    return store;
  }

  async verifyExistingStoreByEmail(
    email: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreByEmail(email);

    if (!store) {
      throw new HttpException(
        message
          ? message
          : `Não existe nenhuma loja com o email ${email} registrada`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return store;
  }

  async verifyExistingStoreById(
    id: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreById(id);

    if (!store) {
      throw new HttpException(
        message ? message : `Não há nenhuma loja registrada com o id ${id}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return store;
  }

  async verifyExistingStoreInUser(
    userId: UUID,
    storeId: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findOneInUserById(userId, storeId);

    if (!store) {
      throw new HttpException(
        message
          ? message
          : `Não há nenhuma loja com o id ${storeId} no usuário ${userId}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return store;
  }

  async verifyThereIsNoStoreWithId(
    id: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreById(id);
    if (store) {
      throw new HttpException(
        message ? message : 'Já existe uma loja registrada com esse id',
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoStoreWithCnpj(
    cnpj: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreByCnpj(cnpj);
    if (store) {
      throw new HttpException(
        message ? message : 'Já existe uma loja registrada com esse cnpj',
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoStoreWithEmail(
    email: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreByEmail(email);
    if (store) {
      throw new HttpException(
        message ? message : 'Já existe uma loja registrada com esse email',
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoStoreWithPhone(
    phone: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreByPhone(phone);
    if (store) {
      throw new HttpException(
        message
          ? message
          : 'Já existe uma loja registrada com esse numero de telefone',
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoStoreWithName(
    name: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreByName(name);
    if (store) {
      throw new HttpException(
        message ? message : 'Já existe uma loja registrada com esse nome',
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }
}
