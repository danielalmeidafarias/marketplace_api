import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetProductDTO {
  @IsUUID()
  id: UUID;
}
