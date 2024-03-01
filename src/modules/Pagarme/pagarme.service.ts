import 'dotenv/config.js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import pagarmeAuthConfig from 'src/config/pagarme-auth.config';
import { Costumer } from './class/Costumer.class';
@Injectable()
export class PagarmeService {
  constructor() {}
  async createCostumer({
    name,
    email,
    document,
    document_type,
    type,
    birthdate,
    phones,
    address,
  }: Costumer) {
    try {
      const response = await axios.post(
        'https://api.pagar.me/core/v5/customers',
        {
          name,
          email,
          document,
          document_type,
          type,
          birthdate,
          phones,
          address,
        },
        { headers: pagarmeAuthConfig },
      );
      return { costumerId: response.data.id };
    } catch (err) {
      // console.error(err.response.data);
      console.error("erro pagarme");
      throw new HttpException(
        'Ocorreu um erro ao tentar cria o costumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
