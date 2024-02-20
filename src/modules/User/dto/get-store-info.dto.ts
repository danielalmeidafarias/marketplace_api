import { IsJWT, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetStoreInfoByUserTokensDTO {
  
  @IsJWT()
  access_token: string

  @IsJWT()
  refresh_token: string

}

export class GetStoreInfoByUserIdDTO {
  @IsUUID()
  @IsOptional()
  storeId: UUID
}