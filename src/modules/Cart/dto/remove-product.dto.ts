import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class RemoveProductDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsUUID()
  @ApiProperty()
  productId: UUID;
}
