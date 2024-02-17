import { IsDateString, IsEmail, IsNumber, IsPhoneNumber, IsPostalCode, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  name: string

  @IsString()
  lastName: string

  @IsString()
  cpf: string

  @IsDateString()
  dataNascimento: Date

  // @IsPostalCode('BR')
  cep: number

  @IsPhoneNumber('BR')
  phone: string
}
