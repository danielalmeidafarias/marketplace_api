import { IsJWT } from "class-validator"

export class GetStoreInfoDTO {
  @IsJWT()
  access_token: string

  @IsJWT()
  refresh_token: string
}