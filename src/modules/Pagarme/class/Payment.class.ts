import { Address } from './Address.class';
import { Cart } from './Cart.class';

export class Payment {
  constructor(
    card: Cart,
    payment_method: 'credit_card' | 'pix',
    creditCard: CreditCardObject | null,
    pix?: PixPaymentObject,
  ) {
    this.amount = card.getCartSubtotal();
    this.payment_method = payment_method;

    if (creditCard) {
      this.credit_card = creditCard;
    }

    if (pix) {
      this.pix = pix;
    }
  }
  payment_method: 'credit_card' | 'pix';
  amount: number;
  antifraud_enabled: true;
  credit_card: CreditCardObject;
  pix: PixPaymentObject;
  split: Split;
}

export class CreditCardObject {
  installments: number;
  card: CreditCard;
  card_id: string;
}

export class CreditCard {
  number: string;
  holder_name: string;
  holder_document: string;
  exp_month: string;
  exp_year: string;
  cvv: string;
  billing_address_id: string;
  billind_address: Address;
}

export class PixPaymentObject {
  expires_in: number;
}

export class Split {
  constructor(card: Cart, recipient_id: string) {
    this.amount = card.getCartSubtotal()
    this.recipient_id = recipient_id
  }
  amount: number
  recipient_id: string
  type: 'flat'

}
