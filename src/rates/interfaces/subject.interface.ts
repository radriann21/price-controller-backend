import { Decimal } from '@prisma/client/runtime/client';

export interface SubjectData {
  message: string;
  rate: {
    id: number;
    source: string;
    rate: Decimal;
    createdAt: Date;
  };
  timestamp: string;
}
