import { UUID } from 'crypto';
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
export class Store {
  constructor(
    email: string,
    name: string,
    password: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
    phone: string,
    cnpj?: string,
    cpf?: string,
    userId?: UUID
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.cep = cep;
    this.logradouro = logradouro
    this.bairro = bairro,
    this.cidade = cidade,
    this.uf = uf
    this.phone = phone;

    cpf ? (this.cpf = cpf) : null;
    cnpj ? (this.cnpj = cpf) : null;

    userId ? (this.userId = this.userId) : null
  }

  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @PrimaryColumn()
  email: string;

  @PrimaryColumn()
  name: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column({ nullable: true })
  cpf: string;

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ nullable: true })
  userId: UUID;

  @Column()
  cep: string;

  @Column()
  logradouro: string;

  @Column()
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  uf: string;

  @PrimaryColumn()
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // products
  // orders
}
