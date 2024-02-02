import { IsJWT } from "class-validator";

export class DeleteUserDTO {

  @IsJWT()
  access_token: JsonWebKey;

  @IsJWT()
  refresh_token: JsonWebKey;

}