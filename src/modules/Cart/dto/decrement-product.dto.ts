import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsJWT, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DecrementProductDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsUUID()
  @ApiProperty()
  productId: UUID;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional()
  quantity?: number;
}
