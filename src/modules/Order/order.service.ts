import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PagarmeService } from '../Pagarme/pagarme.service';

@Injectable()
export class OrderService {
  constructor(
    private authService: AuthService,
    private pagarmeService: PagarmeService,
  ) {}

  async getOne(access_token: string, refresh_token: string, order_id: string) {
    const { newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      order: await this.pagarmeService.getOrder(order_id),
    };
  }

  async getAll(access_token: string, refresh_token: string) {
    const { account, newAccess_token, newRefresh_token } =
      await this.authService.accountVerification(access_token, refresh_token);

    return {
      access_token: newAccess_token,
      refresh_token: newRefresh_token,
      orders: await this.pagarmeService.getOrders(account.costumerId),
    };
  }
}
