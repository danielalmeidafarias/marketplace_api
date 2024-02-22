import { IsJWT, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export interface IDeleteUserStoreDTO {
  access_token: string;
  refresh_token: string;
  storeId: UUID;
  password: string;
}
export class DeleteUserStoreTokensDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  password: string;
}

export class DeleteUserStoreIdDTO {
  @IsUUID()
  storeId: UUID;
}
