import { FC, useMemo } from 'react';
import classes from './PercentageSlider.module.scss';
import { calculatePercentageStep } from '@/utils';
import { Slider } from 'antd';

interface Props {
  activePercentage: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  step: number;
}

export const PercentageSlider: FC<Props> = ({ activePercentage, onChange, min, max, step }) => {
  const stepInSlider = useMemo(() => {
    return calculatePercentageStep({ min, max, step})
  }, [min, max, step])

  const handleChange = (value: number) => {
    onChange(value);
  };

  return (
    <div className={classes.slider}>
      <div className={classes.slider__value}>{`${activePercentage} %`}</div>
      <Slider
        className={classes.slider__input}
        step={stepInSlider}
        min={0}
        max={100}
        value={activePercentage}
        onChange={handleChange}
      />
    </div>
  );
};
