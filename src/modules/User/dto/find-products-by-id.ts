import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class FindProductsByIdDTO {
  @IsUUID()
  id: UUID;
}
