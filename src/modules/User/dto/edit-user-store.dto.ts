import {
  IsJWT,
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsNumberString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

export class EditUserStoreDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsUUID()
  storeId: UUID;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsOptional()
  @IsString()
  newName?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  newPhone?: string;

  @IsOptional()
  @IsNumberString()
  newCEP?: string;
}
