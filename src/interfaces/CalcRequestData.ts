import { AmountTypes } from '@/enums';

export interface CalcRequestData {
  pairId: number;
  [AmountTypes.IN_AMOUNT]?: number | null;
  [AmountTypes.OUT_AMOUNT]?: number | null;
}
