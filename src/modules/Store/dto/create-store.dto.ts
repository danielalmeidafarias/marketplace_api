import {
  IsDateString,
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

  @IsDateString()
  birthdate: Date;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNumberString()
  cnpj: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  mobile_phone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  home_phone: string;

  @IsNumberString()
  cep: string;

  @IsNumberString()
  numero: string

  @IsString()
  @IsOptional()
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

  @IsDateString()
  @IsOptional()
  birthdate: Date;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsNumberString()
  cnpj: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  mobile_phone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  home_phone: string;

  @IsOptional()
  cep: string;

  @IsOptional()
  @IsNumberString()
  numero: string
  
  @IsString()
  @IsOptional()
  complemento: string
}
