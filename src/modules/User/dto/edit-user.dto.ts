import { IsEmail, IsJWT, IsOptional, IsStrongPassword } from 'class-validator';

export class EditUserDTO {
  @IsJWT()
  access_token: JsonWebKey;

  @IsJWT()
  refresh_token: JsonWebKey;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;
}
