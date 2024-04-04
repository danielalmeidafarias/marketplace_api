import 'dotenv/config.js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import pagarmeAuthConfig from 'src/config/pagarme-auth.config';
import { Costumer } from './classes/Costumer';
import { BankAccount, ManagingPartner, Recipient } from './classes/Recipient';
import { UtilsService } from '../utils/utils.service';
import { IManagingPartner } from '../Store/dto/create-store.dto';
import { BillingAddress, CreditCard } from './classes/CreditCard';
import { CartProduct } from '../Cart/entity/cart.entity';
import {
  CreditCardOrder,
  CreditCardPaymentObject,
  PaymentCreditCard,
  PixOrder,
  PixPaymentObject,
  SplitObject,
} from './classes/Order';
@Injectable()
export class PagarmeService {
  constructor(private utilsService: UtilsService) {}
  async createUserCostumer(
    name: string,
    email: string,
    cpf: string,
    birthdate: Date,
    incomingMobilePhone: string,
    incomingHomePhone: string,
    cep: string,
    numero: string,
    complemento: string,
  ) {
    const mobile_phone =
      await this.utilsService.transformCostumerPhone(incomingMobilePhone);

    const home_phone = incomingHomePhone
      ? await this.utilsService.transformCostumerPhone(incomingHomePhone)
      : null;

    const address = await this.utilsService.transformCostumerAddress(
      cep,
      numero,
      complemento,
    );

    const costumer = new Costumer({
      address,
      birthdate,
      document: cpf,
      document_type: 'CPF',
      email,
      name,
      phones: {
        mobile_phone,
        home_phone,
      },
      type: 'individual',
    });

    try {
      const response = await axios.post(
        'https://api.pagar.me/core/v5/customers',
        costumer,
        { headers: pagarmeAuthConfig },
      );

      return {
        message: 'Costumer criado com sucesso',
        costumerId: response.data.id,
        addressId: response.data.address.id,
      };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar cria o costumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createStoreCostumer(
    name: string,
    email: string,
    cpnj: string,
    birthdate: Date,
    incomingMobilePhone: string,
    incomingHomePhone: string,
    cep: string,
    numero: string,
    complemento: string,
  ) {
    const mobile_phone =
      await this.utilsService.transformCostumerPhone(incomingMobilePhone);

    const home_phone = incomingHomePhone
      ? await this.utilsService.transformCostumerPhone(incomingHomePhone)
      : null;

    const address = await this.utilsService.transformCostumerAddress(
      cep,
      numero,
      complemento,
    );

    const costumer = new Costumer({
      document_type: 'CNPJ',
      type: 'company',
      name,
      email,
      document: cpnj,
      birthdate,
      phones: {
        mobile_phone,
        home_phone,
      },
      address,
    });

    try {
      const response = await axios.post(
        'https://api.pagar.me/core/v5/customers',
        costumer,
        { headers: pagarmeAuthConfig },
      );
      return {
        message: 'Costumer criado com sucesso',
        costumerId: response.data.id,
      };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar cria o costumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserCostumer(
    name: string,
    email: string,
    cpf: string,
    birthdate: Date,
    incomingMobilePhone: string,
    incomingHomePhone: string,
    cep: string,
    numero: string,
    complemento: string,
    costumer_Id: string,
  ) {
    try {
      const mobile_phone =
        await this.utilsService.transformCostumerPhone(incomingMobilePhone);

      const home_phone =
        await this.utilsService.transformCostumerPhone(incomingHomePhone);

      const address = await this.utilsService.transformCostumerAddress(
        cep,
        numero,
        complemento,
      );

      const costumer = new Costumer({
        name,
        email,
        costumer_Id,
        document_type: 'CPF',
        type: 'individual',
        document: cpf,
        birthdate,
        phones: {
          mobile_phone,
          home_phone,
        },
        address,
      });

      const response = await axios.put(
        `https://api.pagar.me/core/v5/customers/${costumer_Id}`,
        costumer,
        { headers: pagarmeAuthConfig },
      );

      return {
        message: 'Costumer atualizado com sucesso',
        response: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar o costumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStoreCostumer(
    name: string,
    email: string,
    cpnj: string,
    birthdate: Date,
    incomingMobilePhone: string,
    incomingHomePhone: string,
    cep: string,
    numero: string,
    complemento: string,
    costumer_Id: string,
  ) {
    try {
      const mobile_phone =
        await this.utilsService.transformCostumerPhone(incomingMobilePhone);

      const home_phone =
        await this.utilsService.transformCostumerPhone(incomingHomePhone);

      const address = await this.utilsService.transformCostumerAddress(
        cep,
        numero,
        complemento,
      );

      const costumer = new Costumer({
        name,
        email,
        costumer_Id,
        document_type: 'CNPJ',
        type: 'company',
        document: cpnj,
        birthdate,
        phones: {
          mobile_phone,
          home_phone,
        },
        address,
      });

      const response = await axios.put(
        `https://api.pagar.me/core/v5/customers/${costumer_Id}`,
        costumer,
        { headers: pagarmeAuthConfig },
      );

      return {
        message: 'Costumer atualizado com sucesso',
        response: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar atualizar o costumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUserRecipient(
    name: string,
    email: string,
    document: string,
    incomingBirthdate: Date,
    monthly_income: number,
    professional_occupation: string,
    mobile_phone: string,
    home_phone: string,
    cep: string,
    numero: string,
    complemento: string,
    ponto_referencia: string,
    bank: string,
    branch_check_digit: string,
    branch_number: string,
    account_number: string,
    account_check_digit: string,
    type: 'checking' | 'savings',
  ) {
    const phone_numbers = await this.utilsService.transformRecipientPhone(
      mobile_phone,
      home_phone,
    );
    const address = await this.utilsService.transformRecipientAddress(
      cep,
      numero,
      complemento,
      ponto_referencia,
    );
    const birthdate = incomingBirthdate.toLocaleDateString('BR');

    const default_bank_account = new BankAccount({
      bank,
      branch_number,
      branch_check_digit,
      account_number,
      account_check_digit,
      holder_document: document,
      holder_name: name,
      holder_type: 'individual',
      type,
    });

    const recipient = new Recipient({
      register_information: {
        type: 'individual',
        name,
        email,
        document,
        professional_occupation,
        monthly_income,
        phone_numbers,
        address,
        birthdate,
      },
      default_bank_account,
    });

    try {
      const response = await axios.post(
        'https://api.pagar.me/core/v5/recipients',
        recipient,
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

  async createStoreRecipient(
    company_name: string,
    trading_name: string,
    email: string,
    document: string,
    annual_revenue: number,
    mobile_phone: string,
    home_phone: string,
    cep: string,
    numero: string,
    complemento: string,
    ponto_referencia: string,
    bank: string,
    branch_check_digit: string,
    branch_number: string,
    account_number: string,
    account_check_digit: string,
    type: 'checking' | 'savings',
    incoming_managing_partners: IManagingPartner[],
  ) {
    const phone_numbers = home_phone
      ? await this.utilsService.transformRecipientPhone(
          mobile_phone,
          home_phone,
        )
      : await this.utilsService.transformRecipientPhone(mobile_phone);
    const main_address = await this.utilsService.transformRecipientAddress(
      cep,
      numero,
      complemento,
      ponto_referencia,
    );

    const default_bank_account = new BankAccount({
      bank,
      branch_number,
      branch_check_digit,
      account_number,
      account_check_digit,
      holder_document: document,
      holder_name: company_name,
      holder_type: 'individual',
      type,
    });

    const managing_partners: ManagingPartner[] = [];

    for (let i = 0; i < incoming_managing_partners.length; i++) {
      const phone_numbers = await this.utilsService.transformRecipientPhone(
        mobile_phone,
        home_phone,
      );
      const address = await this.utilsService.transformRecipientAddress(
        cep,
        numero,
        complemento,
        ponto_referencia,
      );

      const managing_partner = new ManagingPartner({
        self_declared_legal_representative:
          incoming_managing_partners[i].self_declared_legal_representative,
        name: incoming_managing_partners[i].name,
        email: incoming_managing_partners[i].email,
        address,
        phone_numbers,
        birthdate: incoming_managing_partners[i].birthdate,
        document,
        monthly_income: incoming_managing_partners[i].monthly_income,
        professional_occupation:
          incoming_managing_partners[i].professional_occupation,
      });

      managing_partners.push(managing_partner);
    }

    const recipient = new Recipient({
      register_information: {
        type: 'corporation',
        company_name,
        email,
        document,
        phone_numbers,
        main_address,
        annual_revenue,
        trading_name,
        managing_partners,
      },
      default_bank_account,
    });

    try {
      const response = await axios.post(
        'https://api.pagar.me/core/v5/recipients',
        recipient,
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

  async createCreditCard(
    customer_id: string,
    brand: string,
    number: string,
    holder_name: string,
    holder_document: string,
    exp_month: number,
    exp_year: number,
    cvv: string,
    billing_address: BillingAddress,
  ) {
    const credit_card = new CreditCard({
      brand,
      number,
      holder_document,
      holder_name,
      exp_month,
      exp_year,
      cvv,
      billing_address,
    });

    try {
      const response = await axios.post(
        `https://api.pagar.me/core/v5/customers/${customer_id}/cards`,
        credit_card,
        { headers: pagarmeAuthConfig },
      );

      return { card: response.data };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao criar o cartao de credito na Api Pagarme, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCreditCards(customer_id: string) {
    try {
      const response = await axios.get(
        `https://api.pagar.me/core/v5/customers/${customer_id}/cards`,
        { headers: pagarmeAuthConfig },
      );

      return {
        wallet: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      if (err.response.status === '404') {
        throw new HttpException(
          'O id fornecido não corresponde a nenhum usuário cadastrado',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Ocorreu um erro ao encontrar os cartões na API do Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteCreditCard(customer_id: string, card_id: string) {
    try {
      const response = await axios.delete(
        `https://api.pagar.me/core/v5/customers/${customer_id}/cards/${card_id}`,
        { headers: pagarmeAuthConfig },
      );

      return {
        wallet: response.data
      }
    } catch (err) {
      console.error(err.response.data);
      if (err.response.status === '404') {
        throw new HttpException(
          'O id fornecido não corresponde a nenhum cartão cadastrado',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Ocorreu um erro ao encontrar os cartões na API do Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async creditCardOrder(
    customer_id: string,
    split: SplitObject[],
    cart: CartProduct[],
    installments: number,
    card_id: string,
    cvv: string,
  ) {
    try {
      const creditCard = new PaymentCreditCard({
        card: {
          cvv,
        },
        card_id,
        installments,
      });

      const creditCardPaymentObject = new CreditCardPaymentObject(creditCard);

      const credit_card_order = new CreditCardOrder({
        customer_id,
        cart,
        split,
        payments: [creditCardPaymentObject],
      });

      const response = await axios.post(
        `https://api.pagar.me/core/v5/orders`,
        credit_card_order,
        { headers: pagarmeAuthConfig },
      );

      return { orderId: response.data.id };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao fazer o pedido na Api Pagarme, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async pixOrder(
    customer_id: string,
    split: SplitObject[],
    cart: CartProduct[],
    subtotal: number,
  ) {
    const pix_payment_object = new PixPaymentObject();

    const pix_order = new PixOrder({
      customer_id,
      cart,
      split,
      payments: [pix_payment_object],
    });

    try {
      const response = await axios.post(
        `https://api.pagar.me/core/v5/orders`,
        pix_order,
        { headers: pagarmeAuthConfig },
      );

      return { orderId: response.data.id };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao fazer o pedido na Api Pagarme, tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAddress(
    customer_id: string,
    cep: string,
    numero: string,
    complemento: string,
  ) {
    try {
      const address = await this.utilsService.transformCostumerAddress(
        cep,
        numero,
        complemento,
      );

      const response = await axios.post(
        `https://api.pagar.me/core/v5/customers/${customer_id}/addresses`,
        address,
        { headers: pagarmeAuthConfig },
      );

      return {
        address: response.data,
      };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Ocorreu um erro ao criar o endereço na API Pagar.me, por favor tente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAddresses(customer_id: string) {
    try {
      const response = await axios.get(
        `https://api.pagar.me/core/v5/customers/${customer_id}/addresses`,
        { headers: pagarmeAuthConfig },
      );

      return {
        addresses: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao acessar a API do Pagar.me, por favor tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAddress(customer_id: string, address_id: string) {
    try {
      const requestOptions = {
        method: 'DELETE',
        url: `https://api.pagar.me/core/v5/customers/${customer_id}/addresses/${address_id}`,
        headers: { authorization: pagarmeAuthConfig.Authorization },
      };

      const response = await axios.request(requestOptions);

      return {
        addresses: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      throw new HttpException(
        'Ocorreu um erro ao tentar excluir o endereço na API Pagar.me, por favor tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
