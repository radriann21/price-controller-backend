export interface GetRateResponse {
  id: number;
  price: string;
  source: {
    id: number;
    name: string;
  };
  trend: string;
  variation: number;
  createdAt: string;
  updatedAt: string;
}
