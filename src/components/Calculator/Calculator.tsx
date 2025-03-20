import { FC } from 'react';
import classes from './Calculator.module.scss';

import { useCalculatorStore } from '@/store';
import { observer } from 'mobx-react-lite';
import { AmountTypes } from '@/enums';
import { Loader } from '../Loader/Loader';
import { CalculatorField } from '../CalculatorField/CalculatorField';


export const Calculator: FC = observer(() => {
  const { isLoaderVisible } = useCalculatorStore();

  return (
    <div className={classes.calculator__wrapper}>
      {isLoaderVisible && (
        <div className={classes.calculator__loaderWrapper}>
          <Loader size={80} />
        </div>
      )}

      <CalculatorField amountType={AmountTypes.IN_AMOUNT} />
      <CalculatorField amountType={AmountTypes.OUT_AMOUNT} />
    </div>
  );
});
