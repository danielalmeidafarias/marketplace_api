import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BillingAddress } from './dto/create-credit-card.dto';
import { UtilsService } from '../utils/utils.service';
import { AuthService } from '../auth/auth.service';
import { PagarmeService } from '../Pagarme/pagarme.service';
import { WalletRepository } from './repository/wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    private utilsService: UtilsService,
    private authService: AuthService,
    private pagarmeService: PagarmeService,
    private walletRepository: WalletRepository,
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

    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const accountId = await this.authService.getTokenId(newAccess_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, account.id);

    const { wallet } = await this.walletRepository.getWallet(accountId);

    const billing_address = await this.utilsService.transformBillingAddress(
      cep,
      numero,
      complemento,
    );

    const { cardId } = await this.pagarmeService.createCreditCard(
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

    const credit_card_ids = [...wallet.credit_card_ids, cardId];

    await this.walletRepository.updateWallet(accountId, credit_card_ids);

    return {
      message: 'Cartão adicionado com sucesso!',
    };
  }
}
