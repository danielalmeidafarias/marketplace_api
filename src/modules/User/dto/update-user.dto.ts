import {
  IsEmail,
  IsJWT,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsStrongPassword()
  newPassword?: string;

  @IsOptional()
  @IsString()
  newName?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  newMobilePhone?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  newHomePhone?: string;

  @IsOptional()
  @IsNumberString()
  newCEP?: string;

  @IsNumberString()
  @IsOptional()
  newNumero: string

  @IsString()
  @IsOptional()
  newComplemento: string
}
