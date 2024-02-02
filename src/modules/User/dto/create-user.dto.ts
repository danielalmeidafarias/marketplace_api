import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDTO {

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

}