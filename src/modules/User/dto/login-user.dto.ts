import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class LoginUserDTO {

  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

}