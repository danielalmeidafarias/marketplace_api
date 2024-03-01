import { UUID } from 'crypto';
import { Address } from './Address.class';
import { Phones } from './Phones.class';

export class Costumer {
  constructor(
    name: string,
    email: string,
    code: UUID,
    document: string,
    document_type: 'CPF' | 'CNPJ' | 'PASSPORT',
    type: 'individual' | 'company',
    address: Address,
    phones: Phones,
    birthdate: Date,
    costumer_Id?: string,
  ) {
    this.name = name;
    this.email = email;
    this.code = code;
    this.document = document;
    this.document_type = document_type;
    this.type = type;
    this.address = address;
    this.phones = phones;
    this.birthdate = birthdate;

    if (costumer_Id) {
      this.costumer_Id = costumer_Id;
    }
  }

  costumer_Id: string;
  name: string;
  email: string;
  code: UUID;
  document: string;
  document_type: 'CPF' | 'CNPJ' | 'PASSPORT';
  type: 'individual' | 'company';
  address: Address;
  phones: Phones;
  birthdate: Date;
}
