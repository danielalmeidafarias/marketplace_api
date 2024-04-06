import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { AuthService } from '../auth/auth.service';
import { PagarmeService } from '../Pagarme/pagarme.service';

@Injectable()
export class WalletService {
  constructor(
    private utilsService: UtilsService,
    private authService: AuthService,
    private pagarmeService: PagarmeService,
  ) {}

  async createCreditCard(
    access_token: string,
    refresh_token: string,
    brand: string,
    number: string,
    holder_name: string,
    holder_document: string,
    exp_month: number,
    exp_year: number,
    cvv: string,
    cep: string,
    numero: string,
    complemento: string,
  ) {
    if (holder_document.length > 11 && holder_document.length < 14) {
      throw new HttpException(
        'O documento deve ter 11 digitos(cpf) ou 14 digitos(cnpj)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token);

    const billing_address = await this.utilsService.transformBillingAddress(
      cep,
      numero,
      complemento,
    );

    const { card } = await this.pagarmeService.createCreditCard(
      account.costumerId,
      brand,
      number,
      holder_name,
      holder_document,
      exp_month,
      exp_year,
      cvv,
      billing_address,
    );

    return {
      message: 'Cartão adicionado com sucesso!',
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      card,
    };
  }

  async deleteCreditCard(access_token: string, card_id: string) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token);

    const { wallet } = await this.pagarmeService.deleteCreditCard(
      account.costumerId,
      card_id,
    );

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      message: 'Cartao excluido com sucesso!',
      wallet,
    };
  }

  async getCreditCards(access_token: string) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token);

    const { wallet } = await this.pagarmeService.getCreditCards(
      account.costumerId,
    );

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      wallet,
    };
  }
}
