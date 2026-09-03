import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_400Regular_Italic,
  Inter_600SemiBold_Italic,
  Inter_700Bold_Italic,
} from '@expo-google-fonts/inter';

import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { GlobalToast } from '@/components/common/GlobalToast';
import { preloadAppAssets } from '@/services/media/preloadAssets';

import { SettingsProvider } from '@/context/SettingsContext';

SplashScreen.preventAutoHideAsync();

// Lets the popup window opened for web Google sign-in (services/auth/googleAuthWeb)
// signal completion back to the tab that opened it. No-op on native.
WebBrowser.maybeCompleteAuthSession();

function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch (_) {}

    const resetScroll = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }

        // Also reset scroll on all scrollable elements in the page
        const scrollableElements = document.querySelectorAll<HTMLElement>(
          '[data-testid="scroll-view"], [style*="overflow"], div'
        );
        for (let i = 0; i < scrollableElements.length; i++) {
          const el = scrollableElements[i];
          if (el && el.scrollTop > 0) {
            el.scrollTop = 0;
          }
        }
      } catch (_) {}
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 30);
    const t2 = setTimeout(resetScroll, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_400Regular_Italic,
    Inter_600SemiBold_Italic,
    Inter_700Bold_Italic,
  });

  // Runs once on app start — reads the persisted access token and warms image cache
  useEffect(() => {
    useAuthStore.getState().restoreSession();
    preloadAppAssets();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'autofill-dark-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #0C0C0E inset !important;
            -webkit-text-fill-color: #FFFFFF !important;
            caret-color: #FFFFFF !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Root-level provider so every screen — including content rendered inside
          <Modal>, which sits in its own native view hierarchy — reads safe-area
          insets from the same React context instead of each relying on native
          view measurement (unreliable inside Modals). See Screen.tsx. */}
      <SafeAreaProvider>
        <SettingsProvider>
          <StatusBar style="light" />
          <ScrollToTopOnNavigate />
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <GlobalToast />
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

