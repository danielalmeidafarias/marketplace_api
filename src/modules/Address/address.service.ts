import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UtilsService } from '../utils/utils.service';
import { PagarmeService } from '../Pagarme/pagarme.service';

@Injectable()
export class AddressService {
  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    private pagarmeService: PagarmeService,
  ) {}

  async createAddress(
    access_token: string,
    cep: string,
    numero: string,
    complemento: string,
    ponto_referencia: string,
  ) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const accountId = await this.authService.getTokenId(newAccess_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, account.id);

    const { address } = await this.pagarmeService.createAddress(
      account.costumerId,
      cep,
      numero,
      complemento,
    );

    return {
      message: 'Endereço criado com sucesso!',
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      address,
    };
  }

  async getAddresses(access_token: string) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const accountId = await this.authService.getTokenId(newAccess_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, account.id);

    const { addresses } = await this.pagarmeService.getAddresses(
      account.costumerId,
    );

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      addresses,
    };
  }

  async deleteAddress(access_token: string, address_id: string) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.getNewTokens(access_token);

    const accountId = await this.authService.getTokenId(newAccess_token);

    const account = await this.utilsService.verifyExistingAccount(accountId);

    await this.authService.verifyTokenId(access_token, account.id);

    const { addresses} = await this.pagarmeService.deleteAddress(
      account.costumerId,
      address_id,
    );

    return {
      message: "Endereço excluido com sucesso",
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      addresses
    }
  }
}
