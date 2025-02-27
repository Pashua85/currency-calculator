import { FC } from "react";
import classes from './PercentageBar.module.scss'
import classnames from 'classnames';

const percentages: number[] = [25, 50, 75, 100];

interface Props {
  activePercentage: number;
  onChange: (newValue: number) => void;
}

export const PercentageBar: FC<Props> = ({ activePercentage, onChange }) => {
  return (
    <div className={classes.container}>
      {percentages.map((item) => (
        <div
          key={item}
          className={classnames(classes.percentageItem, {[classes.percentageItem_active]: item === activePercentage })}
          onClick={() => onChange(item)}
        >
          {`${item} %`}
        </div>
      ))}
    </div>
  )
}
