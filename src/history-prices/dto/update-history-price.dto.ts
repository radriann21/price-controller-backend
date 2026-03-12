import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryPriceDto } from './create-history-price.dto';

export class UpdateHistoryPriceDto extends PartialType(CreateHistoryPriceDto) {}
