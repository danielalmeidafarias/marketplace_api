import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UUID } from 'crypto';
import { Store } from '../entity/store.entity';
import { DataSource } from 'typeorm';

interface CreateStoreProps {
  email: string;
  password: string;
  name: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  phone: string;
  cnpj?: string;
  cpf?: string;
  userId?: UUID;
}
@Injectable()
export class StoreRepository {
  constructor(private dataSource: DataSource) {}

  async create({
    email,
    password,
    name,
    cep,
    logradouro,
    bairro,
    cidade,
    uf,
    phone,
    cnpj,
    cpf,
    userId,
  }: CreateStoreProps) {
    try {
      await this.dataSource
        .getRepository(Store)
        .createQueryBuilder()
        .insert()
        .values({
          email,
          password,
          name,
          phone,
          cnpj,
          cpf,
          cep,
          logradouro,
          bairro,
          cidade,
          uf,
          userId,
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
      throw new HttpException(
        {
          messaage:
            'Ocorreu um erro ao tentar encontrar a loja, tente novamente mais tarde',
          err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  private async findStoreByCpf(cpf: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.cpf = :cpf', { cpf })
      .getMany();

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
      .where('store.id = :id', { id })
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

  async verifyExistingStoreByEmail(email: string) {
    const store = await this.findStoreByEmail(email);

    if (!store) {
      throw new HttpException(
        `Não existe nenhuma loja com o email ${email} registrada`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (store.userId) {
      throw new HttpException(
        `O endereço de email ${email} é vinculado a uma conta de usuário, por favor faça o login em /user/login`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return store
  }
  
  async verifyExistingStoreById(id: UUID) {
    const store = this.findStoreById(id)

    if(!store) {
      throw new HttpException(`Não há nenhuma loja registrada com o id ${id}`, HttpStatus.BAD_REQUEST)
    }

    return store
  }

  async verifyThereIsNoStoreWithCnpj(cnpj: string) {
    const store = await this.findStoreByCnpj(cnpj);
    if (store) {
      throw new HttpException(
        'Já existe uma loja registrada com esse cnpj',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNotStoreWithEmail(email: string) {
    const store = await this.findStoreByEmail(email);
    if (store) {
      throw new HttpException(
        'Já existe uma loja registrada com esse email',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoStoreWithPhone(phone: string) {
    const store = await this.findStoreByPhone(phone);
    if (store) {
      throw new HttpException(
        'Já existe uma loja registrada com esse numero de telefone',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoStoreWithName(name: string) {
    const store = await this.findStoreByName(name);
    if (store) {
      throw new HttpException(
        'Já existe uma loja registrada com esse nome',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
