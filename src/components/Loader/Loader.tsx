import  { FC } from 'react';
import styles from './Loader.module.scss';

interface Props {
  size?: number,
  thickness?: number,
  color?: string,
}

export const Loader: FC<Props> = ({ size = 100, thickness = 8, color = '#168ACD' }) => {
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * 0.25; // Start at 12 o'clock

  return (
    <div className={styles.loaderContainer}>
      <svg
        className={styles.loaderDonut}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className={styles.donutTrack}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          fill="transparent"
        />
        <circle
          className={styles.donutIndicator}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </div>
  );
};

