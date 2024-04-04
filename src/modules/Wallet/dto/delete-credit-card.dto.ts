import { IsJWT, IsString, isJWT } from 'class-validator';

export class DeleteCreditCardDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  card_id: string;
}
