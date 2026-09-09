import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export interface SparkPoint {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
}

interface ScratchSparklesProps {
  sparks: SparkPoint[];
  width: number;
  height: number;
}

export const ScratchSparkles: React.FC<ScratchSparklesProps> = ({
  sparks,
  width,
  height,
}) => {
  if (!sparks || sparks.length === 0) return null;

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFF7ED" stopOpacity="1" />
            <Stop offset="40%" stopColor="#F59E0B" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {sparks.map((spark) => (
          <React.Fragment key={spark.id}>
            {/* Outer Glow */}
            <Circle
              cx={spark.x}
              cy={spark.y}
              r={spark.size * 2}
              fill="url(#sparkGlow)"
              opacity={spark.opacity * 0.7}
            />
            {/* Inner Core */}
            <Circle
              cx={spark.x}
              cy={spark.y}
              r={spark.size * 0.6}
              fill={spark.color}
              opacity={spark.opacity}
            />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
});
