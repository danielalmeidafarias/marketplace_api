import { IsJWT, IsString } from 'class-validator';

export class DeleteAddressDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  address_id: string;
}
