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
  
  async findStoreByCpf(cpf: string) {
    const store = await this.dataSource
      .getRepository(Store)
      .createQueryBuilder('store')
      .where('store.cpf = :cpf', { cpf })
      .getMany();

    return store;
  }

  async findStoreByPhone(phone: string) {
    const store = await this.dataSource
    .getRepository(Store)
    .createQueryBuilder('store')
    .where('store.phone = :phone', { phone })
    .getOne();

  return store;
  }

  async findStoreById(id: UUID) {
    const store = await this.dataSource
    .getRepository(Store)
    .createQueryBuilder('store')
    .where('store.id = :id', { id })
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

  async verifyThereIsNoStoreWithCnpj(cnpj: string) {
    const store =await this.findStoreByCnpj(cnpj)
    if(store) {
      throw new HttpException('Já existe uma loja registrada com esse cnpj', HttpStatus.BAD_REQUEST)
    }
  }

  async verifyThereIsNotStoreWithEmail(email: string) {
    const store = await this.findStoreByEmail(email)
    if(store) {
      throw new HttpException('Já existe uma loja registrada com esse email', HttpStatus.BAD_REQUEST)
    }
  }

  async verifyThereIsNoStoreWithPhone(phone: string) {
    const store = await this.findStoreByPhone(phone)
    if(store) {
      throw new HttpException('Já existe uma loja registrada com esse numero de telefone', HttpStatus.BAD_REQUEST)
    }
  }

  async verifyThereIsNoStoreWithName(name: string) {
    const store = await this.findStoreByName(name)
    if(store) {
      throw new HttpException('Já existe uma loja registrada com esse nome', HttpStatus.BAD_REQUEST)
    }
  }

}
