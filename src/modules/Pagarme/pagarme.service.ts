import 'dotenv/config.js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { Axios, AxiosError } from 'axios';
import { User } from '../User/entity/user.entity';
import { Phones } from './class/Phones.class';
import { Address } from './class/Address.class';
import pagarmeAuthConfig from 'src/config/pagarme-auth.config';

@Injectable()
export class PagarmeService {
  constructor() {}

  async createCostumer(costumer: User, phones: Phones, address: Address) {
    // const document_type = costumer instanceof User ? 'CPF' : 'CNPJ';
    // const document = costumer instanceof User ? costumer.cpf : costumer.cnpj
    // const type = costumer instanceof User ? 'individual' : 'company'

    let id: string

    await axios
      .post(
        'https://api.pagar.me/core/v5/customers',
        {
          name: costumer.name,
          email: costumer.email,
          document: '43438532840',
          document_type: 'CPF',
          type: 'individual',
          birthdate: costumer.dataNascimento,
          phones,
          address,
        },
        { headers: pagarmeAuthConfig },
      )
      .then((response) => {
        id = response.data.id
      })
      .catch((err) => {
        console.error(err.response.data);
        throw new HttpException(
          'Ocorreu um erro ao tentar cria o costumer',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

      return id

  }
}
