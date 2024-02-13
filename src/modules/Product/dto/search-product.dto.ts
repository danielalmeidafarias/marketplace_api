import { IsString } from 'class-validator';

export class SearchProductDTO {
  @IsString()
  name: string;
}
