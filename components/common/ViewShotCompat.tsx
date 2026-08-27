import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from 'react';
import ViewShot from 'react-native-view-shot';

import type { ViewShotHandle } from '@/types/viewShot';

// Native entry point — re-exports the real react-native-view-shot component.
// Web gets ViewShotCompat.web.tsx instead (see that file for why).
// Retyped against the shared ViewShotHandle so callers can use one ref type
// across both platform variants; the runtime instance is still the real
// ViewShot class, which already exposes `capture()`.
export default ViewShot as unknown as ForwardRefExoticComponent<
  ComponentProps<typeof ViewShot> & RefAttributes<ViewShotHandle>
>;
