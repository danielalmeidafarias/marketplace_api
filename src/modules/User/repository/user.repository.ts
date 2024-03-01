import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createUser({
    name,
    email,
    bairro,
    cep,
    numero,
    complemento,
    cidade,
    cpf,
    dataNascimento,
    home_phone,
    lastName,
    logradouro,
    mobile_phone,
    password,
    uf,
  }: User, costumerId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      this.dataSource.getRepository(User).createQueryBuilder().insert().values({
        name,
        email,
        bairro,
        cep,
        numero,
        complemento,
        cidade,
        cpf,
        dataNascimento,
        home_phone,
        lastName,
        logradouro,
        mobile_phone,
        password,
        uf,
        costumerId,
      }).execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao criar o usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    // try {
    //   await queryRunner.manager.save(user);
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   await queryRunner.rollbackTransaction();
    //   console.error(err);
    //   throw new HttpException(
    //     'Ocorreu um erro ao criar o usuário, tente novamente mais tarde',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // } finally {
    //   queryRunner.release();
    // }
  }

  async getUserInfo(id: UUID) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      const user = await queryBuilder
        .select('user')
        .from(User, 'user')
        .where('id = :id', { id: id })
        .getOne();
      return user;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar encontrar o usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(user: User) {
    const queryBuilder = this.dataSource.createQueryBuilder();

    try {
      queryBuilder
        .update(User)
        .set({
          email: user.email,
          costumerId: user.costumerId,
          password: user.password,
          name: user.name,
          lastName: user.lastName,
          cep: user.cep,
          numero: user.numero,
          complemento: user.complemento,
          logradouro: user.logradouro,
          bairro: user.bairro,
          cidade: user.cidade,
          uf: user.uf,
          phone: user.mobile_phone,
        })
        .where('id = :id', { id: user.id })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: UUID) {
    try {
      await this.dataSource
        .getRepository(User)
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar deletar o usuário, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async findUserById(id: UUID): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  private async findUserByCPF(cpf: string): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.cpf = :cpf', { cpf })
      .getOne();

    return user;
  }

  private async findUserByPhone(mobile_phone: string): Promise<User> {
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.mobile_phone = :mobile_phone', { mobile_phone })
      .getOne();

    return user;
  }

  async verifyExistingUserById(
    id: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpException(
        message ? message : `O id ${id} não corresponde a nenhum usuário`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async verifyExistingUserByEmail(
    email: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        message ? message : `O email ${email} não corresponde a nenhum usuário`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async verifyExistingUserByCPF(
    cpf: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const user = await this.findUserByCPF(cpf);

    if (!user) {
      throw new HttpException(
        message ? message : `O cpf ${cpf} não corresponde a nenhum usuário`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoUserWithEmail(
    email: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const user = await this.findUserByEmail(email);

    if (user) {
      throw new HttpException(
        message
          ? message
          : `Já existe um usuário registrado com o email ${email}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoUserWithCPF(
    cpf: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const user = await this.findUserByCPF(cpf);

    if (user) {
      throw new HttpException(
        message ? message : `Já existe um usuário registrado com o cpf ${cpf}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoUserWithPhone(
    phone: string,
    message?: string,
    status?: HttpStatus,
  ) {
    const user = await this.findUserByPhone(phone);

    if (user) {
      throw new HttpException(
        message
          ? message
          : `Já existe um usuário registrado com o phone ${phone}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyThereIsNoUserWithId(
    id: UUID,
    message?: string,
    status?: HttpStatus,
  ) {
    const user = await this.findUserById(id);
    if (user) {
      throw new HttpException(
        message ? message : `Já existe um usuário registrado com o id ${id}`,
        status ? status : HttpStatus.BAD_REQUEST,
      );
    }
  }
}
