import { FC } from "react";
import classes from './PercentageBar.module.scss'
import { PercentageButton } from "../PercentageButton/PercentageButton";

const percentages: number[] = [25, 50, 75, 100];

interface Props {
  activePercentage: number;
  onChange: (newValue: number) => void;
}

export const PercentageBar: FC<Props> = ({ activePercentage, onChange }) => {
  return (
    <div className={classes.container}>
      {percentages.map((item, i, arr) => (
        <PercentageButton 
          key={item}
          activePercentage={activePercentage}
          onClick={onChange}
          maxValue={item}
          minValue={arr[i - 1] ?? 0}
        />
      ))}
    </div>
  )
}
