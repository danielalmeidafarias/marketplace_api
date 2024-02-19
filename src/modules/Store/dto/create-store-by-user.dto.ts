import { IsEmail, IsIdentityCard, IsJWT, IsNumber, IsOptional, IsPhoneNumber, IsPostalCode, IsString, IsStrongPassword, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateStoreByUserDTO {
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

  @IsNumber()
  @IsOptional()
  cnpj?: string

  @IsPhoneNumber('BR')
  @IsOptional()
  phone: string

  @IsPostalCode('BR')
  @IsOptional()
  cep: string
}