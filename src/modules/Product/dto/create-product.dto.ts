import {
  IsInt,
  IsJWT,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
export class CreateProductDTO {
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
