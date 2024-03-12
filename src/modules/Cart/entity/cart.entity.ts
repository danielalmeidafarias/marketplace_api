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
  constructor(productId: UUID, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
  productId: UUID;
  quantity: number;
}
