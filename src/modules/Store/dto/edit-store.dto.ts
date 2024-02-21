import {
  IsJWT,
  IsString,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsPhoneNumber,
  IsNumberString,
} from 'class-validator';

export class EditStoreDTO {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsStrongPassword()
  newPassword?: string;

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
