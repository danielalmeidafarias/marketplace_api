export interface ICostumerPhoneContructorParameters {
  country_code: string;
  area_code: string;
  number: string;
}

export class CostumerPhone {
  constructor({
    country_code,
    area_code,
    number,
  }: ICostumerPhoneContructorParameters) {
    this.country_code = country_code;
    this.area_code = area_code;
    this.number = number;
  }
  country_code: string;
  area_code: string;
  number: string;
}

export class CostumerPhones {
  constructor(mobile_phone: CostumerPhone, home_phone: CostumerPhone) {
    this.mobile_phone = mobile_phone;
    this.home_phone = home_phone;
  }
  mobile_phone: CostumerPhone;
  home_phone: CostumerPhone;
}

export interface ICostumerAddressConstructorParameters {
  address_id?: string;
  line_1: string;
  line_2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  costumer_id?: string;
}

export class CostumerAddress {
  constructor({
    line_1,
    line_2,
    zip_code,
    city,
    state,
    country,
    costumer_id,
    address_id,
  }: ICostumerAddressConstructorParameters) {
    this.line_1 = line_1;
    this.line_2 = line_2;
    this.zip_code = zip_code;
    this.city = city;
    this.state = state;
    this.country = country;

    if (costumer_id) {
      this.costumer_id = costumer_id;
    }

    if (address_id) {
      this.address_id = address_id;
    }
  }
  address_id?: string;
  line_1: string;
  line_2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  costumer_id?: string;
}

export interface ICostumerConstructorParameters {
  name: string;
  email: string;
  document: string;
  document_type: 'CPF' | 'CNPJ' | 'PASSPORT';
  type: 'individual' | 'company';
  address: CostumerAddress;
  phones: CostumerPhones;
  birthdate: Date;
  costumer_Id?: string;
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
  }: ICostumerConstructorParameters) {
    this.address = address;
    this.document = document;
    this.document_type = document_type;
    this.email = email;
    this.name = name;
    this.phones = phones;
    this.type = type;
    this.birthdate = birthdate;

    if (costumer_Id) {
      this.costumer_Id = costumer_Id;
    }
  }

  costumer_Id?: string;
  name: string;
  email: string;
  document: string;
  document_type: 'CPF' | 'CNPJ' | 'PASSPORT';
  type: 'individual' | 'company';
  address: CostumerAddress;
  phones: CostumerPhones;
  birthdate: Date;
}
