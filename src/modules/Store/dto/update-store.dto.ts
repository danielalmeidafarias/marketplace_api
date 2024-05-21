import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  newEmail?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  newName?: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  @ApiPropertyOptional()
  newMobilePhone: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  @ApiPropertyOptional()
  newHomePhone: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  newCEP?: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  newNumero?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  newComplemento?: string;
}

export class EditUserStoreQuery {
  @IsUUID()
  @ApiProperty()
  storeId: UUID;
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

export class UpdateStoreDTO extends EditUserStoreBodyDTO {
  @IsOptional()
  @IsStrongPassword()
  @ApiPropertyOptional()
  newPassword?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  new_annual_revenue: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  new_trading_name: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ManagingPartner)
  @ApiPropertyOptional()
  new_managing_partners: ManagingPartner[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  new_ponto_referencia: string;
}
