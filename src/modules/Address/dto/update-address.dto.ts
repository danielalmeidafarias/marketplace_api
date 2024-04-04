import { IsJWT, IsNumberString, IsString, Length } from 'class-validator';

export class UpdateAddressDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  customer_id: string;

  @IsString()
  address_id: string;

  @IsNumberString()
  @Length(8, 8)
  cep: string;

  @IsNumberString()
  numero: string;

  @IsString()
  complemento: string;

  @IsString()
  ponto_referencia: string;
}
