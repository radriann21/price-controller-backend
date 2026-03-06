import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  costUsd: number;

  @IsNumber()
  profitMargin: number;

  @IsNumber()
  priceVes: number;
}
