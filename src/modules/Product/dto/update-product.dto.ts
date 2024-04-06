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
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsOptional()
  @IsString()
  newName?: string;

  @IsOptional()
  @IsString()
  newDescription?: string;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  newPrice?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  newQuantity?: number;
}

export class UpdateProductStoreQuery {
  @IsUUID()
  productId: UUID;
}
