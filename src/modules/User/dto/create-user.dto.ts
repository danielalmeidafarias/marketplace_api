import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsNumberString()
  @Length(11, 11)
  @ApiProperty()
  cpf: string;

  @IsDateString()
  @ApiProperty()
  birthdate: Date;

  @IsNumberString()
  @Length(8, 8)
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

  @IsPhoneNumber()
  @ApiProperty()
  mobile_phone: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiPropertyOptional()
  home_phone?: string;
}
