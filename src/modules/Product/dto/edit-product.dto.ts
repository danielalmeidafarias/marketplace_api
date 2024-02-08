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

export class EditProductDto {
  @IsUUID()
  id: UUID;

  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity: number;
}
