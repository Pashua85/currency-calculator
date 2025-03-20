import { ChangeEventHandler, FC } from 'react';
import classes from './PercentageSlider.module.scss';

interface Props {
  activePercentage: number;
  onChange: (newValue: number) => void;
}

export const PercentageSlider: FC<Props> = ({ activePercentage, onChange }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className={classes.slider}>
      <div className={classes.slider__value}>{`${activePercentage} %`}</div>
      <input
        type='range'
        className={classes.slider__input}
        step='0.0001'
        min='0'
        max='100'
        value={activePercentage}
        onChange={handleChange}
      />
    </div>
  );
};
