import { ApiProperty } from '@nestjs/swagger';
import {
  IsJWT,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreditCardOrderDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsNumber()
  @Max(12)
  @Min(1)
  @ApiProperty()
  installments: number;

  @IsString()
  @ApiProperty()
  card_id: string;

  @IsNumberString()
  @ApiProperty()
  cvv: string;
}

export class PixOrderDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;
}
