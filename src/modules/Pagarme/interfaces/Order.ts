import { CartProduct } from 'src/modules/Cart/entity/cart.entity';

export class SplitObject {
  constructor(amount: number, recipient_id: string) {
    this.amount = amount * 0.9;
    this.recipient_id = recipient_id;
  }
  amount: number;
  recipient_id: string;
  type: 'flat';
  options: {
    charge_processing_fee: true;
    charge_remainder_fee: true;
    liable: true;
  };
}

export interface ICreditCardPaymentObject {
  payment_method: 'credit_card';
  credit_card: {
    installments: number;
    statement_descriptor: 'FreeMarket';
    card_id: string;
    card: {
      cvv: string;
    };
  };
}

export interface IPixPaymentObject {
  payment_method: 'pix';
  pix: {
    expires_in: 240

  }
}

export class CreditCardOrder {
  constructor(
    customer_id: string,
    cart: CartProduct[],
    split: SplitObject[],
    payments: ICreditCardPaymentObject[],
  ) {
    this.customer_id = customer_id;
    this.items = cart;
    this.split = split;
    this.payments = payments;
  }

  customer_id: string;

  items: CartProduct[];

  payments: ICreditCardPaymentObject[];

  split: SplitObject[];
}

export class PixOrder {
  constructor(
    customer_id: string,
    cart: CartProduct[],
    split: SplitObject[],
    payments: IPixPaymentObject[],
  ) {
    this.customer_id = customer_id
    this.items = cart
    this.split = split
    this.payments = payments
  }

  customer_id: string;

  items: CartProduct[];

  payments: IPixPaymentObject[];

  split: SplitObject[];
}
