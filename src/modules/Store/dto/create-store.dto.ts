import { IsEmail, IsIdentityCard, IsJWT, IsNumber, IsNumberString, IsOptional, IsPhoneNumber, IsPostalCode, IsString, IsStrongPassword, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateStoreDTO {
  @IsString()
  name: string
  
  @IsEmail()
  email: string

  @IsStrongPassword()
  password: string

  @IsNumberString()
  cnpj: string

  @IsPhoneNumber('BR')
  phone: string

  // @IsPostalCode('BR')
  @IsNumberString()
  cep: string
}