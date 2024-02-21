import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export interface IDeleteUserStoreDTO {
  access_token: string;
  refresh_token: string;
  storeId: UUID;
}
export class DeleteUserStoreTokensDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class DeleteUserStoreIdDTO {
  @IsUUID()
  storeId: UUID;
}
