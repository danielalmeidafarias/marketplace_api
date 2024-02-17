import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetUserInfoDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
