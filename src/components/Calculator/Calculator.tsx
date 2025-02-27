import { FC, useState } from "react";
import classes from './Calculator.module.scss';
import { CalculatorField } from "../CalculatorField/CalculatorField";
import { Currencies } from "../../enums/currencies.enum";
import {Decimal} from "decimal.js-light"

const EXCHANGE_RATE = 100;
const hundredDecimal = new Decimal(100);
const exchangeRateDecimal = new Decimal(EXCHANGE_RATE);

export const Calculator: FC = () => {
  const [wholeValueInUsdt, setWholeValueInUsdt] = useState<number>(400);
  const [rubValue, setRubValue] = useState<string>('10000');
  const [usdtValue, setUsdtValue] = useState<string>('100');
  const [rubPercentage, setRubPercentage] = useState<number>(25);
  const [usdtPercentage, setUsdtPercentage] = useState<number>(25);

  const handleChange = (value: string, currency: Currencies) => {
    const numericNewValue = parseFloat(value);  
    const isNewValueNaN = isNaN(numericNewValue);

    if (isNewValueNaN && currency === Currencies.RUB) {
      setRubValue(value);
      setUsdtValue('0');
      setWholeValueInUsdt(0)
      return;
    }

    if (isNewValueNaN && currency === Currencies.USTD) {
      setUsdtValue(value);
      setRubValue('0');
      setWholeValueInUsdt(0)
      return;
    }

    const decimalValue = new Decimal(numericNewValue);
    const rubPercentageDecimal = new Decimal(rubPercentage);
    const usdtPercentageDecimal = new Decimal(usdtPercentage);
    
    if (currency === Currencies.RUB) {
      setRubValue(value);
      const wholeValueInUsdtDecimal = decimalValue
        .dividedBy(rubPercentageDecimal)
        .times(hundredDecimal)
        .dividedBy(exchangeRateDecimal)
      setWholeValueInUsdt(wholeValueInUsdtDecimal.toNumber());

      setUsdtValue(
        wholeValueInUsdtDecimal.dividedBy(hundredDecimal).times(usdtPercentageDecimal).toString()
      )
      return;
    }

    const wholeValueInUsdtDecimal = decimalValue
      .dividedBy(usdtPercentage)
      .times(hundredDecimal)
    setWholeValueInUsdt(wholeValueInUsdtDecimal.toNumber());

    const rubValueDecimal = wholeValueInUsdtDecimal.dividedBy(hundredDecimal).times(rubPercentageDecimal).times(exchangeRateDecimal);
    setRubValue(rubValueDecimal.modulo(1).toNumber() === 0 ? rubValueDecimal.toString() : rubValueDecimal.toFixed(2));
    setUsdtValue(value);
  }

  const handlePercentageChange = (value: number, currency: Currencies) => {
    const wholeValueInUsdtDecimal = new Decimal(wholeValueInUsdt);
    const percentageDecimal = new Decimal(value);

    if (currency === Currencies.RUB) {
      setRubPercentage(value);
      const rubValueDecimal = wholeValueInUsdtDecimal.dividedBy(hundredDecimal).times(percentageDecimal).times(exchangeRateDecimal);
      setRubValue(rubValueDecimal.modulo(1).toNumber() === 0 ? rubValueDecimal.toString() : rubValueDecimal.toFixed(2));
      return
    }

    setUsdtValue(wholeValueInUsdtDecimal.dividedBy(hundredDecimal).times(percentageDecimal).toString());
    setUsdtPercentage(value);
  }

  return (
    <div className={classes.calculator__wrapper}>
      <CalculatorField
        value={rubValue}
        onInputChange={handleChange}
        currency={Currencies.RUB}
        decimalLimit={2}
        activePercentage={rubPercentage}
        onPercentageChange={handlePercentageChange}
      />
      <CalculatorField
        value={usdtValue}
        onInputChange={handleChange}
        currency={Currencies.USTD}
        activePercentage={usdtPercentage}
        onPercentageChange={handlePercentageChange}
      />
    </div>
  )
}
