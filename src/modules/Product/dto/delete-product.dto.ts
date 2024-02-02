import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteProductDTO {
  @IsUUID()
  id: UUID;

  @IsJWT()
  access_token: JsonWebKey;

  @IsJWT()
  refresh_token: JsonWebKey;
}
