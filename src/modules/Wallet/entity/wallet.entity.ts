import { UUID } from 'crypto';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @PrimaryColumn()
  userId: UUID;

  @Column('simple-json', { default: [] })
  credit_card_ids: string[];
}
