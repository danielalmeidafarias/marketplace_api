import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsJWT,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class UpdateUserDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  newEmail?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  password: string;

  @IsOptional()
  @IsStrongPassword()
  @ApiPropertyOptional()
  newPassword?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  newName?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  @ApiPropertyOptional()
  newMobilePhone?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  @ApiPropertyOptional()
  newHomePhone?: string;

  @IsOptional()
  @IsNumberString()
  @Length(8, 8)
  @ApiPropertyOptional()
  newCEP?: string;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  newNumero: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  newComplemento: string;
}
