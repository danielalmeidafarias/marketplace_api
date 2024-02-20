import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteStoreByUserTokensDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class DeleteStoreByUserIdDTO {
  @IsUUID()
  storeId: UUID;
}
