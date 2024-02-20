import { IsJWT, IsUUID } from "class-validator"
import { UUID } from "crypto"

export class GetStoreInfoDTO {
  @IsJWT()
  access_token: string

  @IsJWT()
  refresh_token: string

}