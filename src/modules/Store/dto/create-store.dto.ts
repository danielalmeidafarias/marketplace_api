import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsNumberString()
  @ApiProperty()
  cnpj: string;

  @IsPhoneNumber('BR')
  @ApiProperty()
  mobile_phone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  @ApiProperty()
  home_phone: string;

  @IsNumberString()
  @ApiProperty()
  cep: string;

  @IsNumberString()
  @ApiProperty()
  numero: string;

  @IsString()
  @ApiProperty()
  complemento: string;

  @IsString()
  @ApiProperty()
  ponto_referencia: string;

  @IsNumberString()
  @Length(3)
  @ApiProperty()
  bank_digit: string;

  @IsNumberString()
  @Length(4)
  @ApiProperty()
  branch_number: string;

  @IsNumberString()
  @Length(1)
  @ApiProperty()
  branch_check_digit: string;

  @IsNumberString()
  @Length(5, 13)
  @ApiProperty()
  account_number: string;

  @IsNumberString()
  @Length(1)
  @ApiProperty()
  account_check_digit: string;

  @IsString()
  @IsIn(['checking', 'savings'])
  @ApiProperty()
  account_type: 'checking' | 'savings';

  @IsNumber()
  @ApiProperty()
  annual_revenue: number;

  @IsString()
  @ApiProperty()
  trading_name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ManagingPartner)
  @ApiProperty({isArray: true, example: [{
    name: 'string',
    email: 'string',
    cpf: 'string',
    birthdate: 'Date',
    monthly_income: 'number',
    professional_occupation: 'string',
    self_declared_legal_representative: 'boolean',
    cep: 'string',
    numero: 'string',
    complemento: 'string',
    ponto_referencia: 'string',
    mobile_phone: 'string',
    home_phone: 'string',
  }]})
  managing_partners: ManagingPartner[];
}

export class CreateUserStoreDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsString()
  @ApiProperty()
  professional_occupation: string;

  @IsNumber()
  @ApiProperty()
  monthly_income: number;

  @IsNumberString()
  @Length(3)
  @ApiProperty()
  bank_digit: string;

  @IsNumberString()
  @Length(4)
  @ApiProperty()
  branch_number: string;

  @IsNumberString()
  @Length(1)
  @ApiProperty()
  branch_check_digit: string;

  @IsNumberString()
  @Length(5, 13)
  @ApiProperty()
  account_number: string;

  @IsNumberString()
  @Length(1)
  @ApiProperty()
  account_check_digit: string;

  @IsString()
  @IsIn(['checking', 'savings'])
  @ApiProperty()
  account_type: 'checking' | 'savings';
}

export class ManagingPartner {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNumberString()
  @Length(11, 11)
  @ApiProperty()
  cpf: string;

  @IsDateString()
  @ApiProperty()
  birthdate: Date;

  @IsNumber()
  @ApiProperty()
  monthly_income: number;

  @IsString()
  @ApiProperty()
  professional_occupation: string;

  @IsBoolean()
  @ApiProperty()
  self_declared_legal_representative: boolean;

  @IsNumberString()
  @ApiProperty()
  cep: string;

  @IsNumberString()
  @ApiProperty()
  numero: string;

  @IsString()
  @ApiProperty()
  complemento: string;

  @IsString()
  @ApiProperty()
  ponto_referencia: string;

  @IsPhoneNumber('BR')
  @ApiProperty()
  mobile_phone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  @ApiPropertyOptional()
  home_phone: string;
}

export interface IManagingPartner extends ManagingPartner {}
