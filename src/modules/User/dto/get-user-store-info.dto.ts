import { IsJWT, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export interface IGetUserStoreInfoDTO {
  access_token: string;
  refresh_token: string;
  storeId: UUID;
}

export class GetUserStoreInfoTokensDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class GetUserStoreInfoIdDTO {
  @IsUUID()
  @IsOptional()
  storeId: UUID;
}
