import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteProductBodyDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;
}

export class DeleteProductStoreQueryDTO {
  @IsUUID()
  @ApiProperty()
  productId: UUID;
}
