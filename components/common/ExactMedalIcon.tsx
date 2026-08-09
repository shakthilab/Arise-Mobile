import React from 'react';
import Svg, { Path } from 'react-native-svg';

export interface ExactMedalIconProps {
  size?: number;
  color?: string;
  bgColor?: string;
}

export function ExactMedalIcon({
  size = 56,
  color = '#71717A',
  bgColor = '#121215',
}: ExactMedalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Top Ribbon Banner */}
      <Path
        d="M 18 8 H 46 V 38 L 32 32 L 18 38 Z"
        fill={color}
      />

      {/* Two Vertical Inner Cutout Stripes */}
      <Path
        d="M 25 13 V 30 M 39 13 V 30"
        stroke={bgColor}
        strokeWidth="3.5"
        strokeLinecap="square"
      />

      {/* Bottom 5-Point Star */}
      <Path
        d="M 32 34 L 35.8 42 L 44.5 43.1 L 38.1 49.1 L 39.8 57.6 L 32 53.4 L 24.2 57.6 L 25.9 49.1 L 19.5 43.1 L 28.2 42 Z"
        fill={color}
      />
    </Svg>
  );
}
