/**
 * PLACEHOLDER game balance — not final. Levels use a simple quadratic curve
 * (100 * level^1.5 XP to reach the next level) until product defines real
 * numbers. Swap this table/formula out in one place; utils/xpCalculator.ts
 * is the only consumer.
 */
export const XP_CURVE_BASE = 100;
export const XP_CURVE_EXPONENT = 1.5;
export const MAX_LEVEL = 100;
