/**
 * Phase 2 features are gated behind flags so their folders/services can be
 * scaffolded ahead of time without exposing unfinished UI.
 */
export const featureFlags = {
  guilds: false,
  resonancePartnerMatching: false,
  healthSync: false,
  premiumSubscriptions: false,
  socialSharing: false,
} as const;

export type FeatureFlag = keyof typeof featureFlags;
