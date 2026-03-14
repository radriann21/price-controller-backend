import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalProfitDto } from './create-global-profit.dto';

export class UpdateGlobalProfitDto extends PartialType(CreateGlobalProfitDto) {}
