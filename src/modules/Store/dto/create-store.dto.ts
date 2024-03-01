import {
  IsEmail,
  IsJWT,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateStoreDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNumberString()
  cnpj: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsNumberString()
  cep: string;

  @IsNumberString()
  numero: string

  @IsString()
  complemento: string
}

export class CreateUserStoreDTO {
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

  @IsOptional()
  cep: string;

  @IsNumberString()
  numero: string
  
  @IsString()
  @IsOptional()
  complemento: string
}
