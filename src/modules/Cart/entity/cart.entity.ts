import { UUID } from 'crypto';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @PrimaryColumn()
  userId: UUID;

  @Column('simple-json', { default: [] })
  products: CartProduct[];
}

export class CartProduct {
  constructor(
    productId: UUID,
    recipientId: string,
    quantity: number,
    amount: number,
    description: string,
  ) {
    this.productId = productId;
    this.recipientId = recipientId;
    this.quantity = quantity;
    this.description = description;
    this.amount = amount;
  }
  productId: UUID;
  recipientId: string;
  quantity: number;
  amount: number;
  description: string;
}
