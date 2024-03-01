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

  async updateCostumer({
    name,
    email,
    document,
    document_type,
    type,
    birthdate,
    phones,
    costumer_Id
  }: Costumer) {
    try {
      console.log(document)
      const response = await axios.put(
        `https://api.pagar.me/core/v5/customers/${costumer_Id}`,
        {
          name,
          email,
          document,
          document_type,
          type,
          birthdate,
          phones,
        },
        { headers: pagarmeAuthConfig },
      );

      console.log(response)
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar o costumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
