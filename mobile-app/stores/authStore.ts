import { normalizeAuthError } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isOnboardingCompleted: boolean;
  sendOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  completeOnboarding: (name: string) => Promise<{ error: any }>;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  isOnboardingCompleted: false,

  sendOtp: async (phone) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      set({ loading: false });
      return { error: normalizeAuthError(error) };
    }

    set({
      user: data.user,
      loading: false,
    });

    return { error: null };
  },

  verifyOtp: async (phone, token) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      set({ loading: false });
      return { error: normalizeAuthError(error) };
    }

    set({
      user: data.user,
      loading: false,
    });

    return { error: null };
  },

  completeOnboarding: async (name: string) => {
    const user = get().user;
    if (!user) return { error: "User not found" };

    set({ loading: true });

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      full_name: name,
      onboarding_completed: true,
    });

    if (error) {
      set({ loading: false });
      return { error: "Failed to save profile" };
    }

    set({
      isOnboardingCompleted: true,
      loading: false,
    });

    return { error: null };
  },

  initialize: async () => {
    if (get().initialized) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    let onboardingCompleted = false;

    if (session?.user) {
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .single();

      onboardingCompleted = !!data?.onboarding_completed;
    }

    set({
      user: session?.user ?? null,
      loading: false,
      initialized: true,
      isOnboardingCompleted: onboardingCompleted,
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({
      user: null,
      loading: false,
    });
  },
}));
