import { Stack } from "expo-router";
import { useEffect } from "react";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useAuthStore } from "@/stores/authStore";

export default function RootLayout() {
  const authUser = useAuthStore((s) => s.authUser);
  const profile = useAuthStore((s) => s.profile);
  const initialize = useAuthStore((S) => S.initialize);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) return null;

  return (
    <GluestackUIProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!authUser}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/verify" />
        </Stack.Protected>

        <Stack.Protected
          guard={!!authUser && profile?.onboarding_completed === false}
        >
          <Stack.Screen name="(auth)/onboarding" />
        </Stack.Protected>

        <Stack.Protected
          guard={!!authUser && profile?.onboarding_completed === true}
        >
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  );
}
