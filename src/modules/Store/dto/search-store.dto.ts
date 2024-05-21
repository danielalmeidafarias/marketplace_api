import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class SearchStoreDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  id?: UUID;
}
