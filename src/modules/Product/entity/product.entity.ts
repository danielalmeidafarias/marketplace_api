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
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
