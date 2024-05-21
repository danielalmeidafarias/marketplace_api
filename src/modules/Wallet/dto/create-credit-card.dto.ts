import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  cep: string;

  @IsNumberString()
  @ApiProperty()
  numero: string;

  @IsString()
  @ApiProperty()
  complemento: string;
}

export class CreateCreditCardBodyDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
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
  @ApiProperty({ example: ['elo', 'mastercard', 'visa', 'amex', 'jcb', 'aura', 'hipercard', 'diners', 'unionpay', 'discover'] })
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
  @ApiProperty()
  number: string;

  @IsString()
  @ApiProperty()
  holder_name: string;

  @IsNumberString()
  @Length(11, 14)
  @IsOptional()
  @ApiPropertyOptional()
  holder_document: string;

  @IsInt()
  @Min(1)
  @Max(12)
  @ApiProperty()
  exp_month: number;

  @IsInt()
  // @Length(2, 2)
  @ApiProperty()
  exp_year: number;

  @IsNumberString()
  @Length(3, 4)
  @ApiProperty()
  cvv: string;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillingAddress)
  @ApiProperty({
    example: {
      cep: 'string',
      numero: 'string',
      complemento: 'string',
    }
  })
  billing_address: BillingAddress;
}
