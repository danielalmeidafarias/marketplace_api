import { WalletService } from './wallet.service';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CreateCreditCardBodyDTO } from './dto/create-credit-card.dto';
import { AuthGuard } from '../Auth/auth.guard';
import { GetCreditCardsDTO } from './dto/get-credit-cards.dto';
import { DeleteCreditCardDTO } from './dto/delete-credit-card.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('/wallet')
@ApiTags('Wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Post('/add')
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
      brand,
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

  @UseGuards(AuthGuard)
  @Get('/get')
  async getCreditCards(
    @Body() { access_token, refresh_token }: GetCreditCardsDTO,
  ) {
    return await this.walletService.getCreditCards(access_token, refresh_token);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteCreditCard(
    @Body() { access_token, refresh_token, card_id }: DeleteCreditCardDTO,
  ) {
    return await this.walletService.deleteCreditCard(
      access_token,
      refresh_token,
      card_id,
    );
  }
}
