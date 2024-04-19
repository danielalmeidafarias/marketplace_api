import 'dotenv/config.js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
import pagarmeAuthConfig from 'src/config/pagarme-auth.config';
import { Costumer, CostumerAddress, CostumerPhone } from './classes/Costumer';
import {
  ManagingPartner,
  Recipient,
  RecipientPhone,
} from './classes/Recipient';
import { UtilsService } from '../Utils/utils.service';
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

export interface IGetCostumer {
  id: string;
  name: string;
  email: string;
  address: CostumerAddress;
  phones: {
    home_phone: CostumerPhone;
    mobile_phone: CostumerPhone;
  };
}

export interface IGetPJRecipient {
  id: string;
  name: string;
  email: string;
  document: string;
  type: string;
  default_bank_account: {
    id: string;
    holder_name: string;
    holder_type: string;
    holder_document: string;
    bank: string;
    branch_number: string;
    branch_check_digit: string;
    account_number: string;
    account_check_digit: string;
    type: string;
    status: string;
  };
  register_information: {
    email: string;
    document: string;
    type: string;
    phone_numbers: RecipientPhone[];
    company_name: string;
    trading_name: string;
    annual_revenue: string;
    founding_date: string;
    main_address: {
      street: string;
      complementary: string;
      street_number: string;
      neighborhood: string;
      city: string;
      state: string;
      zip_code: string;
      reference_point: string;
    };
    managing_partners: ManagingPartner[];
  };
}

@Injectable()
export class PagarmeService {
  constructor(private utilsService: UtilsService) {}
  public async createCostumer(costumer: Costumer) {
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao tentar cria o costumer',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async updateCostumer(costumer: Costumer) {
    try {
      const response = await axios.put(
        `https://api.pagar.me/core/v5/customers/${costumer.costumer_Id}`,
        costumer,
        { headers: pagarmeAuthConfig },
      );

      return {
        message: 'Costumer atualizado com sucesso',
        response: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao tentar atualizar o costumer',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async getCostumer(customer_id: string) {
    try {
      const response = await axios.get(
        `https://api.pagar.me/core/v5/customers/${customer_id}`,
        { headers: pagarmeAuthConfig },
      );

      const { name, email, id, phones, address }: IGetCostumer = response.data;

      return {
        costumer: {
          name,
          email,
          id,
          phones,
          address,
        },
      };
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao tentar encontrar o costumer',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async createRecipient(recipient: Recipient) {
    try {
      const response = await axios.post(
        'https://api.pagar.me/core/v5/recipients',
        recipient,
        { headers: pagarmeAuthConfig },
      );
      return { recipientId: response.data.id };
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao tentar criar o recipient na API Pagar.me, por favor tente novamente',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async updateRecipient(recipient: Recipient) {
    try {
      const response = await axios.put(
        `https://api.pagar.me/core/v5/recipients/${recipient.recipient_id}`,
        recipient,
        { headers: pagarmeAuthConfig },
      );

      return {
        message: 'Recipient atualizado com sucesso',
        response: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        console.log(err.response.data);
        throw new HttpException(
          { err: err.response.data },
          err.response.status,
        );
      } else {
        throw new HttpException(
          'Ocorreu um erro ao tentar atualizar o costumer',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async getRecipient(recipient_id: string) {
    try {
      const response = await axios.get(
        ` https://api.pagar.me/core/v5/recipients/${recipient_id}`,
        { headers: pagarmeAuthConfig },
      );

      const {
        id,
        register_information,
        name,
        email,
        document,
        type,
        default_bank_account,
      }: IGetPJRecipient = response.data;

      return {
        recipient: {
          id,
          register_information,
          name,
          email,
          document,
          type,
          default_bank_account,
        },
      };
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao encontrar o recipient na API do Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async createCreditCard(
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao criar o cartao de credito na Api Pagarme, tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async getCreditCards(customer_id: string) {
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao encontrar os cartões na API do Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async deleteCreditCard(customer_id: string, card_id: string) {
    try {
      const response = await axios.delete(
        `https://api.pagar.me/core/v5/customers/${customer_id}/cards/${card_id}`,
        { headers: pagarmeAuthConfig },
      );

      return {
        wallet: response.data,
      };
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao encontrar os cartões na API do Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async createAddress(
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao criar o endereço na API Pagar.me, por favor tente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async getAddresses(customer_id: string) {
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao acessar a API do Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async deleteAddress(customer_id: string, address_id: string) {
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao tentar excluir o endereço na API Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async creditCardOrder(
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao fazer o pedido na Api Pagarme, tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async pixOrder(
    customer_id: string,
    split: SplitObject[],
    cart: CartProduct[],
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
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao fazer o pedido na Api Pagarme, tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async getOrders(customer_id: string) {
    try {
      const response = await axios.get(
        `https://api.pagar.me/core/v5/orders?customer_id=${customer_id}`,
        { headers: pagarmeAuthConfig },
      );

      const { data } = response.data;

      return data;
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao encontrar os pedidos na api Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async getOrder(order_id: string) {
    try {
      const response = await axios.get(
        `https://api.pagar.me/core/v5/orders/${order_id}`,
        { headers: pagarmeAuthConfig },
      );

      return response.data;
    } catch (err) {
      console.error(err.response.data);
      if (isAxiosError(err)) {
        console.error(err.response.status);
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(
          'Ocorreu um erro ao encontrar o pedido na api Pagar.me, por favor tente novamente mais tarde',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
