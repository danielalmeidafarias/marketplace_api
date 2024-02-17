import { IsEmail, IsJWT, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

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
