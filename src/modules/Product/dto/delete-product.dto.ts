import { IsJWT, IsUUID } from 'class-validator';
import { UUID } from 'crypto';


export class DeleteProductBodyDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class DeleteProductStoreQueryDTO {
  @IsUUID()
  productId: UUID
}

export class DeleteProductUserQueryDTO extends DeleteProductStoreQueryDTO {
  @IsUUID()
  storeId: UUID
}
