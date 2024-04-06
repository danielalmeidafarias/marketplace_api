import { IsJWT } from 'class-validator';

export class GetAddressesDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
