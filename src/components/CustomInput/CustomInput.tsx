import { ChangeEventHandler, ClipboardEventHandler, FC, KeyboardEventHandler } from 'react';
import classes from './CustomInput.module.scss';
import { Currencies } from '../../enums/currencies.enum';
import Decimal from 'decimal.js-light';
import { addStep, subtractStep } from '@/utils';

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  currency: Currencies;
  min: number;
  max: number;
  step?: number;
  decimalLimit?: number | null;
  disabled?: boolean;
}

export const CustomInput: FC<Props> = ({
  value,
  onChange,
  currency,
  min,
  max,
  step = 15,
  decimalLimit = null,
  disabled = false,
}) => {
  const handleChange = (newValue: string) => {
    const newValueNum = parseFloat(newValue);

    if (
      typeof decimalLimit === 'number' &&
      newValue.length > value.length &&
      newValue.split('.')[1]?.length > decimalLimit
    ) {
      return;
    }

    if (!isNaN(newValueNum) && newValueNum >= min && newValueNum <= max) {
      onChange(newValue);
    }
  };

  const handleChangeEvent: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    handleChange(newValue);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === '0' && value === '0') {
      event.preventDefault();
      return;
    }

    if (value === '0' && event.key.match(/[1-9]/g)) {
      event.preventDefault();
      onChange(event.key);
      return;
    }

    if (event.key === 'ArrowDown') {
      const possibleValue = subtractStep(value, step);

      if (!isNaN(possibleValue) && possibleValue >= min) {
        onChange(possibleValue.toString());
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      const possibleValue = addStep(value, step);

      if (!isNaN(possibleValue) && possibleValue <= max) {
        onChange(possibleValue.toString());
      }
      return;
    }

    if ([',', '.'].includes(event.key) && (value.match(/[,.]/g) || value === '')) {
      event.preventDefault();
      return;
    }

    if ([',', '.'].includes(event.key) && !decimalLimit) {
      event.preventDefault();
      return;
    }

    if (event.key === ',') {
      onChange(value + '.');
      event.preventDefault();
      return;
    }

    if (
      !event.key.match(/[0-9.]/g) &&
      !['Backspace', 'ArrowRight', 'ArrowLeft', 'Tab'].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    const pastedText = event.clipboardData.getData('text');
    const possibleValue = new Decimal(pastedText).toNumber();

    if (!isNaN(possibleValue)) {
      handleChange(pastedText);
    }
  };

  return (
    <div className={classes.input__wrapper}>
      <input
        className={classes.input}
        value={value}
        onChange={handleChangeEvent}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        onPaste={handlePaste}
      />
      <div className={classes.input__currency}>{currency}</div>
    </div>
  );
};
