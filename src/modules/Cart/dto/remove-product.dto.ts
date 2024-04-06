import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class RemoveProductDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsUUID()
  productId: UUID;
}
