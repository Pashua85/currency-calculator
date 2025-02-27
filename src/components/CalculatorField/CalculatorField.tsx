import { FC } from "react"
import classes from './CalculatorField.module.scss';
import { CustomInput } from "../CustomInput/CustomInput";
import { Currencies } from "../../enums/currencies.enum";
import { PercentageBar } from "../PercentageBar/PercentageBar";

interface Props {
  value: string;
  onInputChange: (newValue: string, currency: Currencies) => void;
  onPercentageChange: (newValue: number, currency: Currencies) => void;
  currency: Currencies;
  decimalLimit?: number | null;
  activePercentage: number;
}

export const CalculatorField: FC<Props> = ({ value, onInputChange, currency, decimalLimit, activePercentage, onPercentageChange }) => {
  return (
    <div className={classes.field}>
      <CustomInput
        value={value}
        currency={currency}
        onChange={(newValue) => onInputChange(newValue, currency)}
        decimalLimit={decimalLimit}
      />
      <div className={classes.divider}></div>
      <PercentageBar activePercentage={activePercentage} onChange={(value) => onPercentageChange(value, currency)} />
    </div>
  )
}
