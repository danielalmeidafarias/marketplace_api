import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  name: string;

  @IsNumberString()
  @Length(11, 11)
  cpf: string;

  @IsDateString()
  birthdate: Date;

  @IsNumberString()
  @Length(8, 8)
  cep: string;

  @IsNumberString()
  numero: string;

  @IsString()
  complemento: string;

  @IsString()
  ponto_referencia: string;

  @IsPhoneNumber()
  mobile_phone: string;

  @IsPhoneNumber()
  @IsOptional()
  home_phone?: string;
}
