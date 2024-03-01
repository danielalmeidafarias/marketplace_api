import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsNumberString()
  cpf: string;

  @IsDateString()
  dataNascimento: Date;

  // @IsPostalCode('BR')
  @IsNumberString()
  cep: string;

  @IsNumberString()
  numero: string

  @IsString()
  @IsOptional()
  complemento: string

  @IsPhoneNumber()
  mobile_phone: string;

  @IsPhoneNumber()
  @IsOptional()
  home_phone?: string;
}
