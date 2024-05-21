import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsJWT, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class GetStoreInfoDTO {
  @IsJWT()
  @ApiProperty()
  access_token: string;

  @IsJWT()
  @ApiProperty()
  refresh_token: string;
}

export class GetUserStoreInfoQueryDTO {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  storeId: UUID;
}
