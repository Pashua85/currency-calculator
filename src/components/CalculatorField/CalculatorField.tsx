import { FC } from 'react';
import classes from './CalculatorField.module.scss';
import { CustomInput } from '../CustomInput/CustomInput';
import { PercentageBar } from '../PercentageBar/PercentageBar';
import { PercentageSlider } from '../PercentageSlider/PercentageSlider';
import { useCalculatorStore } from '@/store';
import { observer } from 'mobx-react-lite';
import { AmountTypes } from '@/enums';
import { CURRENCIES } from '@/constants';

interface Props {
  amountType: AmountTypes;
}

export const CalculatorField: FC<Props> = observer(({ amountType }) => {
  const {
    inAmountString,
    outAmountString,
    handleInputChange,
    isLoaderVisible,
    inAmountMax,
    inAmountMin,
    outAmountMax,
    outAmountMin,
    stepIn,
    stepOut,
    decimalLimitIn,
    decimalLimitOut,
    handlePercentageChange,
    percentageIn,
    percentageOut,
  } = useCalculatorStore();

  const propsData = {
    [AmountTypes.IN_AMOUNT]: {
      min: inAmountMin,
      max: inAmountMax,
      currency: CURRENCIES[amountType],
      value: inAmountString,
      step: stepIn,
      decimalLimit: decimalLimitIn,
      percentage: percentageIn
    },
    [AmountTypes.OUT_AMOUNT]: {
      min: outAmountMin,
      max: outAmountMax,
      currency: CURRENCIES[amountType],
      value: outAmountString,
      step: stepOut,
      decimalLimit: decimalLimitOut,
      percentage: percentageOut
    },
  }[amountType];

  return (
    <div className={classes.field}>
      <CustomInput
        value={propsData.value}
        currency={propsData.currency}
        step={propsData.step}
        onChange={(newValue) => handleInputChange(newValue, amountType)}
        decimalLimit={propsData.decimalLimit}
        disabled={isLoaderVisible}
        min={propsData.min ?? 0}
        max={propsData.max ?? 0}
      />
      <div className={classes.divider}></div>
      <PercentageSlider
        activePercentage={propsData.percentage}
        onChange={(value) => handlePercentageChange(value, amountType)}
      ></PercentageSlider>
      <PercentageBar
        activePercentage={propsData.percentage}
        onChange={(value) => handlePercentageChange(value, amountType)}
      />
    </div>
  );
});
