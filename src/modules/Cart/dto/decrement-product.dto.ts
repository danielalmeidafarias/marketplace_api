import { IsInt, IsJWT, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DecrementProductDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsUUID()
  productId: UUID;

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;
}
