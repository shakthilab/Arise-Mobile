/** Minimal shape both the native (react-native-view-shot) and web-stub ViewShot ref expose. */
export type ViewShotHandle = {
  capture?: () => Promise<string>;
};
