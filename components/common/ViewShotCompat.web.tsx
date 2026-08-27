import React, { forwardRef, useImperativeHandle } from 'react';
import { View, ViewProps } from 'react-native';

import type { ViewShotHandle } from '@/types/viewShot';

type ViewShotCompatProps = ViewProps & {
  options?: { format?: string; quality?: number };
};

/**
 * react-native-view-shot is a native-only module (no web implementation) —
 * importing it in a web bundle crashes Metro with "Cannot read properties of
 * undefined (reading 'getEnforcing')". This stub just renders a plain View
 * and exposes no `capture` method, so callers using `ref.current?.capture?.()`
 * degrade gracefully (e.g. profile.tsx falls back to a text-only share).
 */
const ViewShotCompat = forwardRef<ViewShotHandle, ViewShotCompatProps>(
  ({ options: _options, ...rest }, ref) => {
    useImperativeHandle(ref, () => ({}), []);
    return <View {...rest} />;
  }
);

export default ViewShotCompat;
