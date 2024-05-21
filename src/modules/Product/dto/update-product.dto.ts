import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsJWT,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

export class UpdateProductBodyDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  newName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  newDescription?: string;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @ApiPropertyOptional()
  newPrice?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional()
  newQuantity?: number;
}

export class UpdateProductStoreQuery {
  @IsUUID()
  @ApiProperty()
  productId: UUID;
}
