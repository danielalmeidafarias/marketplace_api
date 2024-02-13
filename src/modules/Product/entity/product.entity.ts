import { UUID } from 'crypto';
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
  constructor(name: string, userId: UUID, price: number, quantity?: number) {
    this.name = name;
    this.price = price;
    this.userId = userId;

    quantity ? (this.quantity = quantity) : null;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  quantity: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  userId: UUID;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
