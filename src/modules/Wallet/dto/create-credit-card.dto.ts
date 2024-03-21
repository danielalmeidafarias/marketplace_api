import { Type } from 'class-transformer';
import {
  IsNumberString,
  Length,
  IsString,
  IsIn,
  IsInt,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
  Min,
  Max,
  IsJWT,
  IsOptional,
} from 'class-validator';

export class BillingAddress {
  @IsNumberString()
  @Length(8, 8)
  cep: string;

  @IsNumberString()
  numero: string;

  @IsString()
  complemento: string;
}

export class CreateCreditCardBodyDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsIn([
    'elo',
    'mastercard',
    'visa',
    'amex',
    'jcb',
    'aura',
    'hipercard',
    'diners',
    'unionpay',
    'discover',
  ])
  brand:
    | 'elo'
    | 'mastercard'
    | 'visa'
    | 'amex'
    | 'jcb'
    | 'aura'
    | 'hipercard'
    | 'diners'
    | 'unionpay'
    | 'discover';

  @IsNumberString()
  number: string;

  @IsString()
  holder_name: string;

  @IsNumberString()
  @Length(11, 14)
  @IsOptional()
  holder_document: string;

  @IsInt()
  @Min(1)
  @Max(12)
  exp_month: number;

  @IsInt()
  // @Length(2, 2)
  exp_year: number;

  @IsNumberString()
  @Length(3, 4)
  cvv: string;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillingAddress)
  billing_address: BillingAddress;
}
