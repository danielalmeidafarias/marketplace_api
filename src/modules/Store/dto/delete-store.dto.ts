import { IsJWT, IsString } from 'class-validator';

export class DeleteStoreBodyDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  password: string;
}
