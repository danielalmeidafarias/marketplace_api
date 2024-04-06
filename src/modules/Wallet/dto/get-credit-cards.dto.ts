import { IsJWT } from 'class-validator';

export class GetCreditCardsDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
