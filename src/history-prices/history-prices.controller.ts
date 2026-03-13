import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoryPricesService } from './history-prices.service';
import { CreateHistoryPriceDto } from './dto/create-history-price.dto';
import { UpdateHistoryPriceDto } from './dto/update-history-price.dto';

@Controller('history-prices')
export class HistoryPricesController {
  constructor(private readonly historyPricesService: HistoryPricesService) {}

  @Post()
  create(@Body() createHistoryPriceDto: CreateHistoryPriceDto) {
    return this.historyPricesService.create(createHistoryPriceDto);
  }

  @Get()
  findAll() {
    return this.historyPricesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyPricesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryPriceDto: UpdateHistoryPriceDto) {
    return this.historyPricesService.update(+id, updateHistoryPriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyPricesService.remove(+id);
  }
}
