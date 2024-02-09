import { IsEmail, IsJWT, IsOptional, IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class EditUserDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsOptional()
  @IsStrongPassword()
  newPassword?: string;
}
