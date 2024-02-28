import { IsOptional, IsString, IsUUID } from "class-validator"
import { UUID } from "crypto"

export class SearchProductDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsUUID()
  @IsOptional()
  id?: UUID
}