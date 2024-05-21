import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsJWT,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductStoreDTO {
  @IsString() 
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @ApiProperty()
  price: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional()
  quantity: number;

  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;
}
