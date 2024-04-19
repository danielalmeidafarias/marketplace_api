import { Injectable } from '@nestjs/common';
import { AuthService } from '../Auth/auth.service';
import { PagarmeService } from '../Pagarme/pagarme.service';

@Injectable()
export class AddressService {
  constructor(
    private authService: AuthService,
    private pagarmeService: PagarmeService,
  ) {}

  async createAddress(
    access_token: string,
    refresh_token: string,
    cep: string,
    numero: string,
    complemento: string,
  ) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

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

  async getAddresses(access_token: string, refresh_token: string) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    const { addresses } = await this.pagarmeService.getAddresses(
      account.costumerId,
    );

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      addresses,
    };
  }

  async deleteAddress(
    access_token: string,
    refresh_token: string,
    address_id: string,
  ) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    const { addresses } = await this.pagarmeService.deleteAddress(
      account.costumerId,
      address_id,
    );

    return {
      message: 'Endereço excluido com sucesso',
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      addresses,
    };
  }
}
