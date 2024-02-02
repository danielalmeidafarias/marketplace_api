import { IsJWT } from "class-validator";

export class GetUserInfoDTO {
  @IsJWT()
  access_token: JsonWebKey

  @IsJWT()
  refresh_token: JsonWebKey
}