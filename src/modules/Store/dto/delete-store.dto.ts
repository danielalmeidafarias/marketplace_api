import { IsJWT } from "class-validator";

export class DeleteStoreDTO {
  @IsJWT()
  access_token: string

  @IsJWT()
  refresh_token: string
}