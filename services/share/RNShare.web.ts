// react-native-share is a native-only module (no web implementation) — importing
// it in a web bundle crashes Metro with "Cannot read properties of undefined
// (reading 'getEnforcing')" because it reaches for TurboModuleRegistry at
// module-eval time. This stub keeps the web bundle from ever loading it;
// callers should fall back to RN's built-in `Share.share` when `.open()` throws.
const RNShareWeb = {
  open: async (): Promise<never> => {
    throw new Error('react-native-share is not supported on web');
  },
};

export default RNShareWeb;
