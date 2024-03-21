export interface ICostumer {
  costumer_Id?: string;
  name: string;
  email: string;
  document: string;
  document_type: 'CPF' | 'CNPJ' | 'PASSPORT';
  type: 'individual' | 'company';
  address: ICostumerAddress;
  phones: ICostumerPhones;
  birthdate: Date;
}

export class Costumer {
  constructor({
    address,
    birthdate,
    document,
    document_type,
    email,
    name,
    phones,
    type,
    costumer_Id,
  }: ICostumer) {
    this.costumer_Id = costumer_Id
    this.address = address
    this.document = document
    this.document_type = document_type
    this.email = email
    this.name = name
    this.phones = phones
    this.type = type
    this.birthdate = birthdate
  }

  costumer_Id?: string;
  name: string;
  email: string;
  document: string;
  document_type: 'CPF' | 'CNPJ' | 'PASSPORT';
  type: 'individual' | 'company';
  address: ICostumerAddress;
  phones: ICostumerPhones;
  birthdate: Date;
}

export interface ICostumerPhones {
  mobile_phone: ICostumerPhone;
  home_phone: ICostumerPhone;
}

export interface ICostumerPhone {
  country_code: string;
  area_code: string;
  number: string;
}

export interface ICostumerAddress {
  address_id?: string;
  line_1: string;
  line_2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  costumer_id?: string;
}
