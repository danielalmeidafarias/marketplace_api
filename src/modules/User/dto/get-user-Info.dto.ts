import { IsJWT } from 'class-validator';

export class GetUserInfoDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
