import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsJWT,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  ValidateNested,
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
  ponto_referencia: string;

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
  annual_revenue: number;

  @IsString()
  trading_name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ManagingPartner)
  managing_partners: ManagingPartner[];
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

export class ManagingPartner {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(11, 11)
  cpf: string;

  @IsDateString()
  birthdate: Date;

  @IsNumber()
  monthly_income: number;

  @IsString()
  professional_occupation: string;

  @IsBoolean()
  self_declared_legal_representative: boolean;

  @IsNumberString()
  cep: string;

  @IsNumberString()
  numero: string;

  @IsString()
  complemento: string;

  @IsString()
  ponto_referencia: string;

  @IsPhoneNumber('BR')
  mobile_phone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  home_phone: string;
}

export interface IManagingPartner extends ManagingPartner {}
