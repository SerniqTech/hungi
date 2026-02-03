import { Stack } from "expo-router";
import { useEffect } from "react";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useAuthStore } from "@/stores/authStore";

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const initialize = useAuthStore((S) => S.initialize);
  const isOnboardingCompleted = useAuthStore((s) => s.isOnboardingCompleted);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <GluestackUIProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user && isOnboardingCompleted}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!!user && !isOnboardingCompleted}>
          <Stack.Screen name="(auth)/onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/verify" />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  );
}
