import { IsJWT } from 'class-validator';

export class GetOrdersDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
