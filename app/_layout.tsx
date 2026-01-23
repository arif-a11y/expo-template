import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider } from "@clerk/clerk-expo";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ENV } from "@/config/env";
import { useLoadFonts } from "@/hooks/useLoadFonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fontsLoaded, fontError } = useLoadFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={ENV.CLERK_PUBLISHABLE_KEY}>
        <QueryProvider>
          <ThemeProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
