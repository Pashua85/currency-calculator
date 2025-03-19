import { FC, useContext, useMemo } from "react"
import classes from './CalculatorField.module.scss';
import { CustomInput } from "../CustomInput/CustomInput";
import { Currencies } from "../../enums/currencies.enum";
import { PercentageBar } from "../PercentageBar/PercentageBar";
import { PercentageSlider } from "../PercentageSlider/PercentageSlider";
import { useCalculatorStore } from "@/store";
import { observer } from "mobx-react-lite";
import CalculatorStoreContext from "@/store/CalculatorStoreContext";
import { AmountTypes } from "@/enums";
import { CURRENCIES } from "@/constants";

interface Props {
  // value: string;
  // onInputChange: (newValue: string, currency: Currencies) => void;
  // onPercentageChange: (newValue: number, currency: Currencies) => void;
  amountType: AmountTypes;
  // decimalLimit?: number | null;
  // activePercentage: number;
}

export const AltCalculatorField: FC<Props> = observer(({ amountType }) => {

  const { inAmountString, outAmountString, handleInputChange, isLoaderVisible, 
    inAmountMax, inAmountMin, outAmountMax, outAmountMin, stepIn, stepOut } = useCalculatorStore();

  // const handleChange = (newValue: string, currency: Currencies) => {
  //   if (currency === Currencies.RUB) {
  //     handleInAmountChange(newValue);
  //   } 
  // }

  // const currency = useMemo(() => {
  //   return CURRENCIES[amountType]
  // }, [amountType])

  const propsData = {
    [AmountTypes.IN_AMOUNT]: {
      min: inAmountMin,
      max: inAmountMax,
      currency: CURRENCIES[amountType],
      value: inAmountString,
      step: stepIn,
    },
    [AmountTypes.OUT_AMOUNT]: {
      min: outAmountMin,
      max: outAmountMax,
      currency: CURRENCIES[amountType],
      value: outAmountString,
      step: stepOut,
    }
  }[amountType]


  return (
    <div className={classes.field}>
      <CustomInput
        value={propsData.value}
        currency={propsData.currency}
        step={propsData.step}
        onChange={(newValue) => handleInputChange(newValue, amountType)}
        decimalLimit={propsData.currency === Currencies.RUB ? 2 : 10}
        disabled={isLoaderVisible}
        min={propsData.min ?? 0}
        max={propsData.max ?? 0}
      />
      <div className={classes.divider}></div>
      {/* <PercentageSlider activePercentage={activePercentage} onChange={(value) => onPercentageChange(value, currency)}></PercentageSlider>
      <PercentageBar activePercentage={activePercentage} onChange={(value) => onPercentageChange(value, currency)} /> */}
    </div>
  )
})
