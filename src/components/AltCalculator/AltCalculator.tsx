import { FC } from 'react';
import classes from './Calculator.module.scss';

import { useCalculatorStore } from '@/store';
import { observer } from 'mobx-react-lite';
import { AltCalculatorField } from '../AltCalculatorField/AltCalculatorField';
import { AmountTypes } from '@/enums';
import { Loader } from '../Loader/Loader';


export const AltCalculator: FC = observer(() => {
  const { isLoaderVisible } = useCalculatorStore();

  return (
    <div className={classes.calculator__wrapper}>
      {isLoaderVisible && (
        <div className={classes.calculator__loaderWrapper}>
          <Loader size={80} />
        </div>
      )}

      <AltCalculatorField amountType={AmountTypes.IN_AMOUNT} />
      <AltCalculatorField amountType={AmountTypes.OUT_AMOUNT} />
    </div>
  );
});
