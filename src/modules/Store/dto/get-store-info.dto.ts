import { IsJWT, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetStoreInfoDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class GetUserStoreInfoQueryDTO {
  @IsUUID()
  @IsOptional()
  storeId: UUID;
}
