import { UUID } from 'crypto';
import { Store } from 'src/modules/Store/entity/store.entity';
import { User } from 'src/modules/User/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  constructor(
    storeId: UUID,
    name: string,
    price: number,
    quantity: number,
    productId?: UUID,
  ) {
    this.storeId = storeId;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.available = quantity;

    if (productId) {
      this.id = productId;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  available: number;

  @ManyToOne(() => Store, (store) => store.id)
  user: User;

  @Column()
  storeId: UUID;

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
    userId: UUID,
    name: string,
    price: number,
    quantity: number,
    productId?: UUID,
  ) {
    this.storeId = storeId;
    this.userId = userId;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.available = quantity;

    if (productId) {
      this.id = productId;
    }
  }

  id: UUID;
  name: string;
  price: number;
  quantity: number;
  available: number;
  user: User;
  storeId: UUID;
  userId: UUID;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
