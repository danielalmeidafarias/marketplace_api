import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Store, UserStore } from '../entity/store.entity';
import { DataSource } from 'typeorm';
import { ProductRepository } from 'src/modules/Product/repository/product.repository';

@Injectable()
export class StoreRepository {
  constructor(
    private dataSource: DataSource,
    private productRepository: ProductRepository,
  ) {}

  async create({
    recipientId,
    costumerId,
    email,
    password,
    name,
    birthdate,
    mobile_phone,
    home_phone,
    cnpj,
    cpf,
    cep,
    numero,
    complemento,
    logradouro,
    bairro,
    cidade,
    uf,
    userId,
  }: Store | UserStore) {
    try {
      const store = await this.dataSource
        .getRepository(Store)
        .createQueryBuilder()
        .insert()
        .values({
          recipientId,
          costumerId,
          email,
          password,
          name,
          birthdate,
          mobile_phone,
          home_phone,
          cnpj,
          cpf,
          cep,
          numero,
          complemento,
          logradouro,
          bairro,
          cidade,
          uf,
          userId,
        })
        .execute();

      return { storeId: store.identifiers[0].id };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro durante a criacao da loja, por favor tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStoreInfo(id: UUID) {
    try {
      const store = await this.dataSource
        .createQueryBuilder()
        .select('store')
        .from(Store, 'store')
        .where('store.id = :id', { id })
        .getOne();

      const storeProducts = await this.productRepository.findManyByStoreId(id);

      return {
        store,
        storeProducts,
      };
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
          mobile_phone: store.mobile_phone,
          home_phone: store.home_phone,
          password: store.password,
          cep: store.cep,
          numero: store.numero,
          complemento: store.complemento,
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

  async deleteUserStore(userId: UUID) {
    try {
      const userStore = await this.findByUserId(userId);

      if (userStore) {
        await this.deleteStore(userStore.id);
      }
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao excluir as lojas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(userId: UUID) {
    return await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.userId = :userId', { userId })
      .getOne();
  }

  async searchManyByName(name: string) {
    return await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where(`store.name ~* :name`, { name })
      .getMany();
  }

  async findStoreByEmail(email: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.email = :email', { email })
      .getOne();

    return store;
  }

  async findStoreByCnpj(cnpj: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.cnpj = :cnpj', { cnpj })
      .getOne();

    return store;
  }

  async findStoreByPhone(mobile_phone: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.mobile_phone = :mobile_phone', { mobile_phone })
      .getOne();

    return store;
  }

  async findStoreById(id: UUID) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('id = :id', { id })
      .getOne();

    return store;
  }

  async findStoreByName(name: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.name = :name', { name })
      .getOne();

    return store;
  }

  async findOneInUserById(userId: UUID, storeId: UUID) {
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
    mobile_phone: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const store = await this.findStoreByPhone(mobile_phone);
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
