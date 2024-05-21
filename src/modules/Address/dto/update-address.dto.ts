import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNumberString, IsString, Length } from 'class-validator';

export class UpdateAddressDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsString()
  @ApiProperty()
  customer_id: string;

  @IsString()
  @ApiProperty()
  address_id: string;

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

  @IsString()
  @ApiProperty()
  ponto_referencia: string;
}
