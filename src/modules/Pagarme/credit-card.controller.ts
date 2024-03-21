import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CreateCreditCardBodyDTO } from "../Wallet/dto/create-credit-card.dto";

@Controller('creditcard')
export class CrediCartController {

  @UseGuards(AuthGuard)
  @Post('/creditcard/create')
  async createCreditCard({
    access_token,
    refresh_token,
    number,
    holder_name,
    exp_month,
    exp_year,
    cvv,
    billing_address,
  }: CreateCreditCardBodyDTO) {
    
  }
  
}