import { IsJWT, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteStoreBodyDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  password: string;
}
