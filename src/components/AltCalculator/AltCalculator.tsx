import { FC, useEffect, useState } from "react";
import classes from './Calculator.module.scss';
import { CalculatorField } from "../CalculatorField/CalculatorField";
import { Currencies } from "../../enums/currencies.enum";
import {Decimal} from "decimal.js-light"

import axiosInstance from "../../axiosIstance";
import { useCalculatorStore } from "@/store";
import { observer } from "mobx-react-lite";
import { AltCalculatorField } from "../AltCalculatorField/AltCalculatorField";
import { AmountTypes } from "@/enums";
import { Loader } from "../Loader/Loader";

// import { useCalculatorStore } from "../../store";

const EXCHANGE_RATE = 100;
const hundredDecimal = new Decimal(100);
const exchangeRateDecimal = new Decimal(EXCHANGE_RATE);

export const AltCalculator: FC = observer(() => {

  const { isLoaderVisible } = useCalculatorStore()

  return (
    <div className={classes.calculator__wrapper}>
      { isLoaderVisible && (
        <div className={classes.calculator__loaderWrapper}>
          <Loader size={80} />
        </div>
      )} 

      <AltCalculatorField
        amountType={AmountTypes.IN_AMOUNT}
      />
      <AltCalculatorField
        amountType={AmountTypes.OUT_AMOUNT}
      />
    </div>
  )
});

