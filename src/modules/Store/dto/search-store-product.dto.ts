import { IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class SearchStoreProductDTOQuery {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsUUID()
  productId: UUID
}

export class SearchStoreProductParamDTO {
  @IsUUID()
  id: UUID
}