import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { RatesService } from './rates.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @HttpCode(201)
  @Post()
  create() {
    return this.ratesService.getAndCreateNewRate();
  }

  @HttpCode(200)
  @Get('actual')
  findActual() {
    return this.ratesService.getActualRate();
  }
}
