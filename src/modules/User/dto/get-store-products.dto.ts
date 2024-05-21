import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetStoreProductsDTO {
  @IsUUID()
  @ApiProperty()
  id: UUID;
}
