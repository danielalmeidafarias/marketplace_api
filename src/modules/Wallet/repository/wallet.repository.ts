import { DataSource } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Wallet } from '../entity/wallet.entity';

@Injectable()
export class WalletRepository {
  constructor(private dataSource: DataSource) {}

  async createWallet(userId: UUID) {
    try {
      await this.dataSource
        .getRepository(Wallet)
        .createQueryBuilder()
        .insert()
        .values({
          userId,
        })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar criar a carteira, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateWallet(userId: UUID, credit_card_ids: string[]) {
    try {
      await this.dataSource
        .getRepository(Wallet)
        .createQueryBuilder()
        .where('userId = :userId', { userId })
        .update({
          credit_card_ids,
        })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar adicionar o cartão, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeCreditCard() {}

  async getWallet(userId: UUID) {
    try {
      const wallet = await this.dataSource
        .getRepository(Wallet)
        .createQueryBuilder()
        .where({ userId })
        .getOne();

      return { wallet };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao encontrar a carteira, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteWallet(userId: UUID) {
    try {
      await this.dataSource
        .getRepository(Wallet)
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId })
        .execute();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao tentar excluir a carteira, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
