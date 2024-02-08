import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
