import { IsEmail, IsIdentityCard, IsJWT, IsNumber, IsOptional, IsPhoneNumber, IsPostalCode, IsString, IsStrongPassword, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateStoreDTO {
  @IsJWT()
  @IsOptional()
  access_token: string
  
  @IsOptional()
  @IsJWT()
  refresh_token: string

  @IsString()
  @IsOptional()
  name: string
  
  @IsEmail()
  @IsOptional()
  email: string

  @IsStrongPassword()
  @IsOptional()
  password: string

  @IsNumber()
  @IsOptional()
  cpnj?: string

  @IsNumber()
  @IsOptional()
  cpf?: number

  @IsPhoneNumber('BR')
  @IsOptional()
  phone: string

  @IsPostalCode('BR')
  @IsOptional()
  cep: string
}