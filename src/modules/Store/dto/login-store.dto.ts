import { IsString } from "class-validator"

export class LoginStoreDTO {
  @IsString()
  email: string
  @IsString()
  password: string
}