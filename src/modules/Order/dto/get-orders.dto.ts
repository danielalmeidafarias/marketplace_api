import { IsJWT, IsString } from 'class-validator';

export class GetOrderBodyDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class GetOrderQueryDTO {
  @IsString()
  order_id: string;
}
