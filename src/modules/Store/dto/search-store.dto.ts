import { IsOptional, IsString, IsUUID } from "class-validator"
import { UUID } from "crypto"

export class SearchStoreDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsUUID()
  @IsOptional()
  id?: UUID
}