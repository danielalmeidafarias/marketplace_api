import { Injectable } from '@nestjs/common';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UUID } from 'crypto';

@Injectable()
export class StoreRepository {
  async create(
    email: string,
    password: string,
    name: string,
    cep: number,
    phone: number,
    cpnj?: number,
    cpf?: number,
  ) {}

  async verifyExistingStore(name: string) {}
}
