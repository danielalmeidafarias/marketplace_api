import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class GetOrdersDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;
}
