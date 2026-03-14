import { Controller, Get, Post, Body } from '@nestjs/common';
import { GlobalProfitService } from './global-profit.service';
import { CreateGlobalProfitDto } from './dto/create-global-profit.dto';

@Controller('global-margin')
export class GlobalProfitController {
  constructor(private readonly globalProfitService: GlobalProfitService) {}

  @Post()
  create(@Body() createGlobalProfitDto: CreateGlobalProfitDto) {
    return this.globalProfitService.createOrUpdate(createGlobalProfitDto);
  }

  @Get()
  findOne() {
    return this.globalProfitService.findOne();
  }
}
