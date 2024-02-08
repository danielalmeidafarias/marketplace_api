import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
