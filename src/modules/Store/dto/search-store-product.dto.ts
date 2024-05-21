import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class SearchStoreProductDTOQuery {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  productId: UUID;
}

export class SearchStoreProductParamDTO {
  @IsUUID()
  @ApiProperty()
  id: UUID;
}
