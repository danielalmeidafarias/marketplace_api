import { IsEmail, IsIdentityCard, IsJWT, IsNumber, IsOptional, IsPhoneNumber, IsPostalCode, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateStoreDTO {
  @IsJWT()
  access_token: string
  
  @IsJWT()
  refresh_token: string

  @IsString()
  @IsOptional()
  name: string
  
  @IsEmail()
  @IsOptional()
  email: string

  @IsUUID()
  userId: UUID

  @IsNumber()
  @IsOptional()
  cpnj?: number

  @IsNumber()
  @IsOptional()
  cpf?: number

  @IsPhoneNumber('BR')
  phone: number

  @IsPostalCode('BR')
  cep: number
}