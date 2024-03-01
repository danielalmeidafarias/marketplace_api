import { Cart, CartProduct } from "./Cart.class"
import { Shipping } from "./Shipping.class"

export class Order {
  constructor(costumerId: string, cart: Cart) {
    this.costumer_id = costumerId
    this.items = cart.products
  }
  costumer_id: string
  items: CartProduct[]
  shipping: Shipping
  payments
  antifraud_enabled: true
}