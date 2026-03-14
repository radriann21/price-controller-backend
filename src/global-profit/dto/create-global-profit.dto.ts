import { IsNumber, IsPositive } from 'class-validator';

export class CreateGlobalProfitDto {
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El margen debe ser un número con máximo 2 decimales' },
  )
  @IsPositive({ message: 'El margen debe ser un número positivo' })
  profitMargin: number;
}
