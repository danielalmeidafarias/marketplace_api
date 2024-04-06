import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetStoreProductsDTO {
  @IsUUID()
  id: UUID;
}
