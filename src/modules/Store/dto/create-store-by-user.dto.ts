import {
  IsEmail,
  IsJWT,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';
export class CreateStoreByUserDTO {
  @IsJWT()
  @IsOptional()
  access_token: string;

  @IsOptional()
  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsNumber()
  @IsOptional()
  cnpj?: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  phone: string;

  @IsPostalCode('BR')
  @IsOptional()
  cep: string;
}
