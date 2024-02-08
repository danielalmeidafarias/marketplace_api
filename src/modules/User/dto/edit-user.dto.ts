import { IsEmail, IsJWT, IsOptional, IsStrongPassword } from 'class-validator';

export class EditUserDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;
}
