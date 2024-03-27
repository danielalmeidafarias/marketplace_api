import { CartProduct } from 'src/modules/Cart/entity/cart.entity';

export class SplitObject {
  constructor(amount: number, recipient_id: string) {
    this.amount = amount * 0.9;
    this.recipient_id = recipient_id;
  }
  amount: number;
  recipient_id: string;
  readonly type: string = 'flat';
  readonly options = {
    charge_processing_fee: true,
    charge_remainder_fee: true,
    liable: true,
  };
}
export interface IPaymentCreditCardContructorParameters {
  installments: number;
  card_id: string;
  card: {
    cvv: string;
  };
}
export class PaymentCreditCard {
  constructor({
    installments,
    card,
    card_id,
  }: IPaymentCreditCardContructorParameters) {
    this.installments = installments;
    this.card = card;
    this.card_id = card_id;
  }
  installments: number;
  readonly statement_descriptor: string = 'FreeMarket';
  card_id: string;
  card: {
    cvv: string;
  };
}
export class CreditCardPaymentObject {
  constructor(credit_card: PaymentCreditCard) {
    this.credit_card = credit_card;
  }
  readonly payment_method = 'credit_card';
  credit_card: PaymentCreditCard;
}
export class PixPaymentObject {
  readonly payment_method = 'pix';
  readonly pix = {
    expires_in: 240,
  };
}
export interface ICreditCardOrderConstructorParameters {
  customer_id: string;
  cart: CartProduct[];
  split: SplitObject[];
  payments: CreditCardPaymentObject[];
}
export class CreditCardOrder {
  constructor({
    cart,
    customer_id,
    payments,
    split,
  }: ICreditCardOrderConstructorParameters) {
    this.customer_id = customer_id;
    this.items = cart;
    this.split = split;
    this.payments = payments;
  }

  customer_id: string;

  items: CartProduct[];

  payments: CreditCardPaymentObject[];

  split: SplitObject[];
}
export interface IPixOrderConstructorParameters {
  customer_id: string;
  cart: CartProduct[];
  split: SplitObject[];
  payments: PixPaymentObject[];
}
export class PixOrder {
  constructor({
    customer_id,
    cart,
    payments,
    split,
  }: IPixOrderConstructorParameters) {
    this.customer_id = customer_id;
    this.items = cart;
    this.split = split;
    this.payments = payments;
  }

  customer_id: string;

  items: CartProduct[];

  payments: PixPaymentObject[];

  split: SplitObject[];
}
