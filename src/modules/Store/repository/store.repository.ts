import { Injectable } from '@nestjs/common';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UUID } from 'crypto';

@Injectable()
export class StoreRepository {
  async create(
    name: string,
    cpnj: number | undefined,
    cpf: number | undefined,
    cep: number,
    phone: number,
    userId: UUID,
  ) {}

  async verifyExistingStore(name: string) {}
}
