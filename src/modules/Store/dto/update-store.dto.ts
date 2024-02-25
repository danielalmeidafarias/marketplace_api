import {
  IsJWT,
  IsString,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsPhoneNumber,
  IsNumberString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

export class EditUserStoreBodyDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsOptional()
  password: string;

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

export class EditUserStoreQuery {
  @IsUUID()
  storeId: UUID;
}

export class UpdateStoreDTO extends EditUserStoreBodyDTO {
  @IsOptional()
  @IsStrongPassword()
  newPassword?: string;
}
