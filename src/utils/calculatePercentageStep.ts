import Decimal from "decimal.js-light";

export const calculatePercentageStep = ({ min, max, step}: { min: number, max: number, step: number}): number => {
    const decimalMin: Decimal = new Decimal(min);
    const decimalMax = new Decimal(max);
    const decimalStep = new Decimal(step);

    const stepsCount = decimalMax.minus(decimalMin).div(decimalStep).plus(1);

    return stepsCount.gt(1) 
        ? new Decimal(100).div(stepsCount.minus(1)).toNumber()
        : new Decimal(100).toNumber();
}