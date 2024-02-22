import { IsJWT, IsString } from 'class-validator';

export class DeleteUserDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  password: string;
}
