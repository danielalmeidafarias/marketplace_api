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
export class CreateUserStoreProduct {
  @IsUUID()
  storeId: UUID

  @IsString()
  name: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  quantity: number;

  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
