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
    costumerId: string,
    email: string,
    name: string,
    birthdate: Date,
    password: string,
    cep: string,
    numero: string,
    complemento: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
    mobile_phone: string,
    home_phone: string | null,
    cnpj: string,
    storeId?: UUID,
  ) {
    if (storeId) {
      this.id = storeId;
    }

    this.costumerId = costumerId
    this.cnpj = cnpj;
    this.password = password;
    this.email = email;
    this.name = name;
    this.birthdate = birthdate;
    this.cep = cep;
    this.numero = numero;
    this.complemento = complemento;
    this.logradouro = logradouro;
    this.bairro = bairro;
    this.cidade = cidade;
    this.uf = uf;
    this.mobile_phone = mobile_phone;
    this.home_phone = home_phone
  }

  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @PrimaryColumn()
  costumerId?: string;

  @PrimaryColumn()
  email: string;

  @PrimaryColumn()
  name: string;

  @Column()
  birthdate: Date;

  @Column({ nullable: true })
  cnpj: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ nullable: true })
  userId: UUID;

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
  @PrimaryColumn()
  mobile_phone: string;

  @Column({ nullable: true })
  home_phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

export class UserStore implements Store {
  constructor(
    costumerId: string,
    userId: UUID,
    user: User,
    email: string,
    name: string,
    birthdate: Date,
    cep: string,
    numero: string,
    complemento: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
    mobile_phone: string,
    home_phone: string | null,
    cpf: string,
    cnpj?: string,
    storeId?: UUID,
  ) {
    if (storeId) {
      this.id = storeId;
    }

    if (cnpj) {
      this.cnpj = cnpj;
    }

    this.costumerId = costumerId
    this.userId = userId;
    this.user = user;
    this.cpf = cpf;
    this.email = email;
    this.name = name;
    this.birthdate = birthdate;
    this.cep = cep;
    this.numero = numero;
    this.complemento = complemento;
    this.logradouro = logradouro;
    this.bairro = bairro;
    this.cidade = cidade;
    this.uf = uf;
    this.mobile_phone = mobile_phone;
    this.home_phone = home_phone;
  }

  id: UUID;
  costumerId?: string;
  email: string;
  name: string;
  birthdate: Date;
  cnpj: string;
  cpf: string;
  password: string;
  user: User;
  userId: UUID;
  cep: string;
  numero: string;
  complemento: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  mobile_phone: string
  home_phone: string
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
