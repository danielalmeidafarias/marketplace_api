import {
  IsEmail,
  IsNumberString,
  IsPhoneNumber,
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
}
