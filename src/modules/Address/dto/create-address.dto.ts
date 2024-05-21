import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNumberString, IsString, Length } from 'class-validator';

export class CreateAddressDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

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
