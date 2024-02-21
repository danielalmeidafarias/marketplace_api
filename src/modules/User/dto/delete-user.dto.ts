import { IsEmail, IsJWT, IsString } from 'class-validator';

export class DeleteUserDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
