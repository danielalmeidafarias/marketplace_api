import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetUserInfoDTO {
  @IsUUID()
  id: UUID;

  @IsJWT()
  access_token: string

  @IsJWT()
  refresh_token: string
}
