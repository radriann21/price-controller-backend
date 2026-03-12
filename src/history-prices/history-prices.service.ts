import { Injectable } from '@nestjs/common';
import { CreateHistoryPriceDto } from './dto/create-history-price.dto';
import { UpdateHistoryPriceDto } from './dto/update-history-price.dto';

@Injectable()
export class HistoryPricesService {
  create(createHistoryPriceDto: CreateHistoryPriceDto) {
    return 'This action adds a new historyPrice';
  }

  findAll() {
    return `This action returns all historyPrices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historyPrice`;
  }

  update(id: number, updateHistoryPriceDto: UpdateHistoryPriceDto) {
    return `This action updates a #${id} historyPrice`;
  }

  remove(id: number) {
    return `This action removes a #${id} historyPrice`;
  }
}
