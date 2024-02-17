import {
  IsEmail,
  IsJWT,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class EditUserDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsStrongPassword()
  newPassword?: string;

  @IsOptional()
  @IsString()
  newName?: string;

  @IsOptional()
  @IsString()
  newLastName?: string;

  @IsOptional()
  @IsString()
  newCPF?: string;

  @IsOptional()
  @IsString()
  newPhone?: string;

  @IsOptional()
  @IsString()
  newCEP?: number;
}
