import { useEffect } from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type ScreenProps = ViewProps & {
  children: React.ReactNode;
  /** Which sides to pad for safe-area insets. Defaults to top + bottom. */
  edges?: Edge[];
};

const DEFAULT_EDGES: Edge[] = ['top', 'bottom'];

export function Screen({ children, style, edges = DEFAULT_EDGES, ...rest }: ScreenProps) {
  // Read insets from context (react-navigation/bottom-tabs and our root
  // SafeAreaProvider both supply it) rather than using the `SafeAreaView`
  // native component. `SafeAreaView` measures its own position in the
  // window natively, which is unreliable inside a <Modal> — RN Modals
  // render in a separate native view hierarchy, so that measurement can
  // come back as 0 and collapse the header/footer against the notch/status
  // bar. Context-based insets are plain numbers threaded through React, so
  // they stay correct everywhere: tab screens, stack screens, and Modals.
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      } catch (_) {}
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
