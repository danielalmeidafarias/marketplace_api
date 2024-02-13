import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteProductDTO {
  @IsUUID()
  id: UUID;

  @IsUUID()
  userId: UUID;

  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}
