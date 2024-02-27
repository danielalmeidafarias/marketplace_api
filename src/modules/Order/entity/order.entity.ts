import { UUID } from 'crypto';
import { Entity } from 'typeorm';

@Entity()
export class Order {
  constructor(
    costomerId: string,
    costumerCode: UUID,
    shipping: Shipping,
    payments: Payment,
    items: Items,
  ) {
    this.customerId = costomerId
    this.costumerCode = costumerCode
    this.shipping = shipping
    this.payments = payments
    this.items = items
  }
  id: string;
  status: 'Pending' | 'Paid' | 'Canceled' | 'Failed';
  customerId: string;
  costumerCode: UUID;
  // codigo do cliente no banco de dados
  // Guardar apenas o id dos clientes em Costumers
  shipping: Shipping;
  antifraud_enabled: boolean;
  payments: Payment;
  items: Items;
  closed: boolean;
  created_at: Date;
  updated_at: Date;
}

export class Payment {
  constructor(
    payment_method: 'credit_cart' | 'pix',
    payment_method_object: CreditCartPayment | PixPayment,
  ) {
    this.payment_method = payment_method;
    this.payment_method_object = payment_method_object;
  }
  payment_method: 'credit_cart' | 'pix';
  payment_method_object: CreditCartPayment | PixPayment;
}

export class CreditCartPayment {
  constructor(installments: number, statement_descriptor: string, card: Card) {
    this.card = card;
    this.installments = installments;
    this.statement_descriptor = statement_descriptor;
  }
  installments: number; // numero de parcelas
  statement_descriptor: string; // descricao na fatura do cartao
  card: Card;
}

export class Card {
  constructor(
    number: string,
    holder_name: string,
    exp_month: number,
    exp_year: number,
    cvv: string,
    billing_address_id: string,
  ) {
    this.number = number;
    this.holder_name = holder_name;
    this.exp_month = exp_month;
    this.exp_year = exp_year;
    this.cvv = cvv;
    this.billing_address_id = billing_address_id;
  }
  number: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  billing_address_id: string;
}

export class PixPayment {
  expires_in: number;
}

export class Shipping {
  constructor(
    address: Address,
    amount: number,
    recipient_name: string,
    recipient_phone: string,
    description: string,
  ) {
    this.address = address;
    this.amount = amount;
    this.recipient_name = recipient_name;
    this.recipient_phone = recipient_phone;
    this.description = description;
  }
  amount: number;
  description: string;
  recipient_name: string;
  recipient_phone: string;
  address: object;
}

export class Address {
  constructor(
    country: string,
    state: string,
    city: string,
    zip_code: string,
    line_1: string,
  ) {
    this.country = country;
    this.state = state;
    this.city = city;
    this.zip_code = zip_code;
    this.line_1 = line_1;
  }
  country: string;
  state: string;
  city: string;
  zip_code: string;
  line_1: string;
}

export type Items = Item[];

export class Item {
  amount: number;
  description: string;
  quantity: number;
  code: UUID;
}
