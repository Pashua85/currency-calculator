import Decimal from 'decimal.js-light';

export const subtractStep = (value: string, step: number): number => {
  const decimalA = new Decimal(value);
  const decimalB = new Decimal(step);

  const subtraction = decimalA.minus(decimalB);

  return subtraction.toNumber();
};
