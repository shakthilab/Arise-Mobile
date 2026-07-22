/**
 * Single choke point for premium gating. Phase 2 will wire this to
 * RevenueCat entitlements instead of the static `false` below — screens
 * should only ever call this hook, never check subscription state directly.
 */
export function usePremium() {
  const isPremium = false;
  return { isPremium };
}
