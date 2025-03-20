import { FC, useMemo } from 'react';
import classes from './PercentageButton.module.scss';

interface Props {
  maxValue: number;
  minValue: number;
  onClick: (value: number) => void;
  activePercentage: number;
}

export const PercentageButton: FC<Props> = ({ maxValue, minValue, onClick, activePercentage }) => {
  const buttonStyles = useMemo(() => {
    let percentage = 0;

    if (activePercentage > maxValue) {
      percentage = 100;
    }

    if (activePercentage < minValue) {
      percentage = 0;
    }

    if (activePercentage >= minValue && activePercentage <= maxValue) {
      const width = maxValue - minValue;
      const valueWidth = activePercentage - minValue;
      percentage = (valueWidth / width) * 100;
    }

    return {
      button: {
        backgroundImage: `linear-gradient(to right, #168ACD, #168ACD ${percentage}%, transparent ${percentage}%)`,
      },
      text: {
        backgroundImage: `linear-gradient(to right, #FFFFFF, #FFFFFF ${percentage}%, #168ACD ${percentage}%)`,
      },
    };
  }, [activePercentage, minValue, maxValue]);

  return (
    <div
      className={classes.percentageButton}
      style={buttonStyles.button}
      onClick={() => onClick(maxValue)}
    >
      <div className={classes.percentageButton__text} style={buttonStyles.text}>
        {`${maxValue} %`}
      </div>
    </div>
  );
};
