import { IsNumber, IsString } from 'class-validator';

export class CreateRateDto {
  @IsString()
  source: string;

  @IsNumber()
  rate: number;
}
