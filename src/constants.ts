import { AmountTypes, Currencies } from './enums';

export const IN_AMOUNT_MIN = 10000;
export const IN_AMOUNT_MAX = 70000000;
export const IN_AMOUNT_STEP = 100;
export const OUT_AMOUNT_STEP = 0.000001;
export const PAIR_ID = 133;
export const REQUEST_DELAY_MS = 1000;

export const CURRENCIES: Record<AmountTypes, Currencies> = {
  [AmountTypes.IN_AMOUNT]: Currencies.RUB,
  [AmountTypes.OUT_AMOUNT]: Currencies.USTD,
};
