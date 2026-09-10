import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Path,
} from 'react-native-svg';

export function HealthBackgroundDecor() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          {/* Top Center Ambient Radial Glow */}
          <RadialGradient id="topAuraGlow" cx="50%" cy="16%" r="48%">
            <Stop offset="0%" stopColor="#8A1822" stopOpacity="0.45" />
            <Stop offset="35%" stopColor="#4A0C12" stopOpacity="0.28" />
            <Stop offset="70%" stopColor="#1C0407" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 1. TOP AMBIENT CRIMSON AURA */}
        <Circle cx="200" cy="130" r="180" fill="url(#topAuraGlow)" />

        {/* 2. SUBTLE TOPOGRAPHIC / ENERGY CONTOUR WAVES */}
        {/* Wave 1 */}
        <Path
          d="M -50 80 Q 80 40 200 65 T 450 70"
          stroke="#47141A"
          strokeWidth="1"
          strokeOpacity="0.45"
          fill="none"
        />
        {/* Wave 2 */}
        <Path
          d="M -40 120 Q 100 85 200 105 T 440 115"
          stroke="#5C1820"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          fill="none"
        />
        {/* Wave 3 */}
        <Path
          d="M -30 160 Q 90 135 200 150 T 430 155"
          stroke="#401217"
          strokeWidth="1"
          strokeOpacity="0.35"
          fill="none"
        />
        {/* Wave 4 */}
        <Path
          d="M -40 205 Q 110 180 200 195 T 440 200"
          stroke="#380E13"
          strokeWidth="1"
          strokeOpacity="0.3"
          fill="none"
        />
        {/* Wave 5 (Under Title) */}
        <Path
          d="M -20 255 Q 120 235 200 245 T 420 250"
          stroke="#2C0A0E"
          strokeWidth="1"
          strokeOpacity="0.25"
          fill="none"
        />
      </Svg>
    </View>
  );
}
