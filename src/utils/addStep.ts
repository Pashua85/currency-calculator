import Decimal from 'decimal.js-light';

export const addStep = (value: string, step: number): number => {
  const decimalA = new Decimal(value);
  const decimalB = new Decimal(step);

  const sum = decimalA.add(decimalB);

  return sum.toNumber();
};
