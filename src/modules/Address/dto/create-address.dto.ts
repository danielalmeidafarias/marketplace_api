import { IsJWT, IsNumberString, IsString, Length } from 'class-validator';

export class CreateAddressDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

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
