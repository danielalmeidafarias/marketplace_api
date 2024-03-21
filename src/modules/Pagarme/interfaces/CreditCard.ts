export class CreditCard {
  constructor({
    brand,
    number,
    billing_address,
    cvv,
    exp_month,
    exp_year,
    holder_document,
    holder_name,
  }: ICreditCardConstructor) {
    this.brand = brand
    this.number = number;
    this.billing_address = billing_address;
    this.cvv = cvv;
    this.exp_month = exp_month;
    this.exp_year = exp_year;
    this.holder_document = holder_document;
    this.holder_name = holder_name;
  }
  brand:string
  number: string;
  holder_name: string;
  holder_document: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  billing_address: BillingAddress;
}

export interface ICreditCardConstructor {
  brand:string
  number: string;
  holder_name: string;
  holder_document: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  billing_address: BillingAddress;
}

export class BillingAddress {
  constructor({
    city,
    country,
    line_1,
    line_2,
    state,
    zip_code,
  }: IBillingAddressContructor) {
    this.city = city;
    this.state = state;
    this.country = country;
    this.line_1 = line_1;
    this.line_2 = line_2;
    this.zip_code = zip_code;
  }
  line_1: string;
  line_2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

export interface IBillingAddressContructor {
  line_1: string;
  line_2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}
