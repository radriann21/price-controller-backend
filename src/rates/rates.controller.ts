import { Controller, HttpCode, Post } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @HttpCode(201)
  @Post()
  create() {
    return this.ratesService.getAndCreateNewRate();
  }
}
