import { UUID } from 'crypto';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  constructor(productId: UUID, quantity: number, amount: number, description: string) {
    this.productId = productId;
    this.quantity = quantity; 
    this.description = description
    this.amount = amount
  }
  productId: UUID;
  quantity: number;
  amount: number
  description: string
}
