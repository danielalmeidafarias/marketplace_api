import {
  IsDateString,
  IsEmail,
  IsIn,
  IsJWT,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  IsStrongPassword,
  Length,
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
  numero: string;

  @IsString()
  complemento: string;

  @IsString()
  ponto_referencia: string

  @IsNumberString()
  @Length(3)
  bank_digit: string;

  @IsNumberString()
  @Length(4)
  branch_number: string;

  @IsNumberString()
  @Length(1)
  branch_check_digit: string;

  @IsNumberString()
  @Length(5, 13)
  account_number: string;

  @IsNumberString()
  @Length(1)
  account_check_digit: string;

  @IsString()
  @IsIn(['checking', 'savings'])
  account_type: 'checking' | 'savings';

  @IsNumber()
  annual_revenue: number

  @IsString()
  tranding_name: string
}

export class CreateUserStoreDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  professional_occupation: string;

  @IsNumber()
  monthly_income: number;

  @IsNumberString()
  @Length(3)
  bank_digit: string;

  @IsNumberString()
  @Length(4)
  branch_number: string;

  @IsNumberString()
  @Length(1)
  branch_check_digit: string;

  @IsNumberString()
  @Length(5, 13)
  account_number: string;

  @IsNumberString()
  @Length(1)
  account_check_digit: string;

  @IsString()
  @IsIn(['checking', 'savings'])
  account_type: 'checking' | 'savings';
}
