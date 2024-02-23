import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteUserStoreProductDTO {
  @IsUUID()
  id: UUID;

  @IsUUID()
  storeId: UUID;

  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
