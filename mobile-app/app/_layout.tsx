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

  const isOnboardingCompleted = !!profile?.full_name && !!profile?.building_id;

  const needsName = !!authUser && !profile?.full_name;
  const needsBuilding =
    !!authUser && !!profile?.full_name && !profile?.building_id;

  return (
    <GluestackUIProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Not logged in */}
        <Stack.Protected guard={!authUser}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/verify" />
        </Stack.Protected>

        {/* Needs name */}
        <Stack.Protected guard={needsName}>
          <Stack.Screen name="(auth)/onboarding/set-new-user-name" />
        </Stack.Protected>

        {/* Needs building */}
        <Stack.Protected guard={needsBuilding}>
          <Stack.Screen name="(auth)/onboarding/set-new-user-building" />
        </Stack.Protected>

        {/* Fully onboarded */}
        <Stack.Protected guard={!!authUser && isOnboardingCompleted}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  );
}
