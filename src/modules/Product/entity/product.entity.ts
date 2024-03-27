import { UUID } from 'crypto';
import { Store } from 'src/modules/Store/entity/store.entity';
import { User } from 'src/modules/User/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  constructor(
    storeId: UUID,
    recipient_id: string,
    name: string,
    description: string,
    price: number,
    quantity: number,
    productId?: UUID,
  ) {
    this.storeId = storeId;
    this.recipient_id = recipient_id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.available = quantity;

    if (productId) {
      this.id = productId;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @PrimaryColumn()
  recipient_id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  available: number;

  @Column()
  storeId: UUID;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Column({ nullable: true })
  userId: UUID;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export class UserStoreProduct implements Product {
  constructor(
    storeId: UUID,
    recipient_id: string,
    userId: UUID,
    user: User,
    name: string,
    description: string,
    price: number,
    quantity: number,
    productId?: UUID,
  ) {
    this.storeId = storeId;
    this.recipient_id = recipient_id;
    this.userId = userId;
    this.user = user;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.available = quantity;

    if (productId) {
      this.id = productId;
    }
  }

  storeId: UUID;
  recipient_id: string;
  userId: UUID;
  user: User;
  id: UUID;
  name: string;
  description: string;
  price: number;
  quantity: number;
  available: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
