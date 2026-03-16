import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @IsNumber({}, { message: 'El costo en USD debe ser un número' })
  costUsd: number;

  @IsNumber({}, { message: 'El margen de ganancia debe ser un número' })
  profitMargin: number;

  @IsNumber({}, { message: 'El precio en VES debe ser un número' })
  priceVes: number;

  @IsNumber({}, { message: 'El ID de la categoría debe ser un número' })
  categoryId: number;
}
