import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  constructor(
    costumerId: string,
    // cartId: UUID,
    email: string,
    password: string,
    name: string,
    birthdate: Date,
    cpf: string,
    cep: string,
    numero: string,
    complemento: string,
    ponto_referencia: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
    mobile_phone: string | null,
    home_phone: string | null,
    userId?: UUID
  ) {
    this.costumerId = costumerId
    // this.cartId = cartId
    this.email = email;
    this.password = password;
    this.name = name;
    this.bairro = bairro;
    this.cep = cep;
    this.numero = numero;
    this.complemento = complemento;
    this.ponto_referencia = ponto_referencia
    this.cidade = cidade;
    this.cpf = cpf;
    this.logradouro = logradouro;
    this.mobile_phone = mobile_phone;
    this.uf = uf;
    this.birthdate = birthdate;
    this.home_phone = home_phone

    if (userId) {
      this.id = userId;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: UUID;

  @Column()
  costumerId: string;

  // @OneToOne(() => Cart, cart => cart.id)
  // @Column()
  // cartId: UUID

  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  birthdate: Date;

  @PrimaryColumn()
  cpf: string;

  @Column()
  cep: string;

  @Column()
  numero: string;

  @Column({ nullable: true })
  complemento: string;

  @Column()
  ponto_referencia: string

  @Column()
  logradouro: string;

  @Column()
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  uf: string;

  @Column()
  password: string;

  @Column()
  @PrimaryColumn()
  mobile_phone: string;

  @Column({ nullable: true })
  home_phone: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  // cart
  // orders
}
