import { WalletService } from './wallet.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCreditCardBodyDTO } from './dto/create-credit-card.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Post('/add-card')
  async createCreditCard(
    @Body()
    {
      access_token,
      refresh_token,
      number,
      holder_name,
      holder_document,
      exp_month,
      exp_year,
      cvv,
      billing_address,
      brand
    }: CreateCreditCardBodyDTO,
  ) {
    return await this.walletService.createCreditCard(
      access_token,
      refresh_token,
      brand,
      number,
      holder_name,
      holder_document,
      exp_month,
      exp_year,
      cvv,
      billing_address.cep,
      billing_address.numero,
      billing_address.complemento,
    );
  }
}
