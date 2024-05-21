import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @ApiProperty()
  password: string;
}
