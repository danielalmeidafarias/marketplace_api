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
    cnpj: string,
    storeId?: UUID
    )
    {

      if(storeId) {
        this.id = storeId
      }

      this.cnpj = cnpj
      this.password = password
      this.email = email
      this.name = name
      this.cep = cep
      this.logradouro = logradouro
      this.bairro = bairro
      this.cidade = cidade
      this.uf = uf
      this.phone = phone

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

  @Column({ nullable: true })
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
}

export class UserStore implements Store{
  constructor(    
    email: string,
    name: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
    phone: string,
    cpf: string,
    userId: UUID,
    cnpj?: string,
    storeId?: UUID) {

      if(storeId) {
        this.id = storeId
      }

      if(userId) {
        this.userId = userId
      }

      if(cnpj) {
        this.cnpj = cnpj
      }

      this.cpf = cpf
      this.email = email
      this.name = name
      this.cep = cep
      this.logradouro = logradouro
      this.bairro = bairro
      this.cidade = cidade
      this.uf = uf
      this.phone = phone
  }

  id: UUID;
  email: string;
  name: string;
  cnpj: string;
  cpf: string;
  password: string;
  user: User;
  userId: UUID;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  
}