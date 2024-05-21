import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class GetOrderBodyDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;
}

export class GetOrderQueryDTO {
  @IsString()
  @ApiProperty()
  order_id: string;
}
