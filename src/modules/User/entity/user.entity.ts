import { UUID } from 'crypto';
import { IProduct } from 'src/interfaces/IProduct';
import { Product } from 'src/modules/Product/entity/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
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
    logradouro: string, 
    bairro: string,
    cidade: string, 
    uf: string, 
    phone: string
  ) {
    this.email = email;
    this.password = password;
    this.name = name
    this.bairro = bairro
    this.cep = cep
    this.cidade = cidade
    this.cpf = cpf
    this.logradouro = logradouro
    this.phone =phone
    this.uf = uf
    this.lastName = lastName
    this.dataNascimento = dataNascimento
  }

  @PrimaryGeneratedColumn('uuid')
  id?: UUID;

  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  lastName: string

  @Column()
  dataNascimento: Date;

  @PrimaryColumn()
  cpf: string;

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

  @Column()
  password: string;

  @Column()
  @PrimaryColumn()
  phone: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

}
