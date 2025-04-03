import { ChangeEventHandler, ClipboardEventHandler, FC, KeyboardEventHandler, useEffect, useState } from 'react';
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
  const [localValue, setLocalValue] = useState(value ?? '');

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);


  const handleChange = (newValue: string) => {
    const newValueNum = parseFloat(newValue);
    console.log({newValue})

    if (
      typeof decimalLimit === 'number' &&
      newValue.length > value.length &&
      newValue.split('.')[1]?.length > decimalLimit
    ) {
      return;
    }

    if (newValue === '' || newValueNum <= max) {
      setLocalValue(newValue);
    }

    const dividend = new Decimal(newValueNum);
    const divisor = new Decimal(step);
    const quotient = new Decimal(Math.floor(dividend.div(divisor).toNumber()));

    const remainder = dividend.minus(quotient.mul(divisor)).toNumber();

    if (!isNaN(newValueNum) && newValueNum >= min && newValueNum <= max && remainder === 0) {
      console.log({NEW_VALUE_FOR_ONCHNAG: newValue});
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
      handleChange(event.key);
      return;
    }

    if (event.key === 'ArrowDown') {
      const possibleValue = subtractStep(value, step);

      if (!isNaN(possibleValue) && possibleValue >= min) {
        handleChange(possibleValue.toString());
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      const possibleValue = addStep(value, step);

      if (!isNaN(possibleValue) && possibleValue <= max) {
        handleChange(possibleValue.toString());
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
      const caretPosition = (event.target as HTMLInputElement).selectionStart;
      const newValue = caretPosition ? [
        value.slice(0, caretPosition),
        '.',
        value.slice(caretPosition)
      ].join('') : value + '.';

      handleChange(newValue);
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

  const handleBlur = () => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }

  return (
    <div className={classes.input__wrapper}>
      <input
        className={classes.input}
        value={localValue}
        onChange={handleChangeEvent}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        onPaste={handlePaste}
        onBlur={handleBlur}
      />
      <div className={classes.input__currency}>{currency}</div>
    </div>
  );
};
