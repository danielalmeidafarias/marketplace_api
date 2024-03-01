import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  constructor(
    email: string,
    password: string,
    name: string,
    lastName: string,
    dataNascimento: Date,
    cpf: string,
    cep: string,
    numero: string,
    complemento: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
    mobile_phone: string,
    home_phone?: string,
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.bairro = bairro;
    this.cep = cep;
    this.numero = numero;
    this.complemento = complemento;
    this.cidade = cidade;
    this.cpf = cpf;
    this.logradouro = logradouro;
    this.mobile_phone = mobile_phone;
    this.uf = uf;
    this.lastName = lastName;
    this.dataNascimento = dataNascimento;

    if (home_phone) {
      this.home_phone = home_phone;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: UUID;

  @PrimaryColumn()
  costumerId?: string;

  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  dataNascimento: Date;

  @PrimaryColumn()
  cpf: string;

  @Column()
  cep: string;

  @Column()
  numero: string;

  @Column({ nullable: true })
  complemento: string;

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
