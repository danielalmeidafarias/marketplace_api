import {
  IsDateString,
  IsEmail,
  IsNumberString,
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

  @IsPhoneNumber('BR')
  phone: string;
}
