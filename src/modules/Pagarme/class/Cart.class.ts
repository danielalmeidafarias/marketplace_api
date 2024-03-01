import { UUID } from 'crypto';

export class Cart {
  constructor(products: CartProduct[]) {
    this.products = products;
  }
  
  products: CartProduct[];

  getCartSubtotal() {
    let subtotal: number;

    this.products.forEach((product) => {
      subtotal += product.amount * product.quantity;
    });

    return subtotal;
  }
}

export class CartProduct {
  amount: number;
  description: string;
  quantity: number;
  code: UUID;
}
