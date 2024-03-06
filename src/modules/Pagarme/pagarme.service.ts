import 'dotenv/config.js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import pagarmeAuthConfig from 'src/config/pagarme-auth.config';
import { Costumer } from './class/Costumer.class';
import { Recipient } from './class/Recipient.class';
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
      console.error(err.response.data);
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
    costumer_Id,
  }: Costumer) {
    try {
      console.log(document);
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

      console.log(response);
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar o costumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRecipient({
    default_bank_account,
    register_information,
    // transfer_settings,
  }: Recipient) {
    try {
      const response = await axios.post(
        'https://api.pagar.me/core/v5/recipients',
        {
          register_information,
          default_bank_account,
          // transfer_settings,
        },
        { headers: pagarmeAuthConfig },
      );
      return { recipientId: response.data.id };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar criar o recipient na API Pagar.me, por favor tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
