import { Type } from 'class-transformer';
import {
  IsJWT,
  IsString,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsPhoneNumber,
  IsNumberString,
  IsUUID,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  Length,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';

export class EditUserStoreBodyDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsOptional()
  @IsString()
  newName?: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  newMobilePhone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  newHomePhone: string;

  @IsOptional()
  @IsNumberString()
  newCEP?: string;

  @IsOptional()
  @IsNumberString()
  newNumero?: string;

  @IsOptional()
  @IsString()
  newComplemento?: string;
}

export class EditUserStoreQuery {
  @IsUUID()
  storeId: UUID;
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

export class UpdateStoreDTO extends EditUserStoreBodyDTO {
  @IsOptional()
  @IsStrongPassword()
  newPassword?: string;

  @IsNumber()
  @IsOptional()
  new_annual_revenue: number;

  @IsString()
  @IsOptional()
  new_trading_name: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ManagingPartner)
  new_managing_partners: ManagingPartner[];

  @IsOptional()
  @IsString()
  new_ponto_referencia: string;
}
