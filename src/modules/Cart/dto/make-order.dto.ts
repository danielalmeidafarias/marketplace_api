import {
  IsIn,
  IsJWT,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreditCardOrderDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsNumber()
  @Max(12)
  @Min(1)
  installments: number;

  @IsString()
  card_id: string;

  @IsNumberString()
  cvv: string;
}

export class PixOrderDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
