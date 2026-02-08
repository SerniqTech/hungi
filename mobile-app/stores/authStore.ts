import { normalizeAuthError } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { User as AuthUser } from "@supabase/supabase-js";
import { create } from "zustand";

type AppUser = Database["public"]["Tables"]["users"]["Row"];
interface AuthState {
  authUser: AuthUser | null;
  profile: AppUser | null;
  loading: boolean;
  initialized: boolean;
  isOnboardingCompleted: boolean;
  sendOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  saveUserName: (name: string) => Promise<{ error: any }>;
  saveBuilding: (name: string | null) => Promise<{ error: any }>;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  profile: null,
  loading: false,
  initialized: false,
  isOnboardingCompleted: false,

  sendOtp: async (phone) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithOtp({ phone });

    set({ loading: false });

    return { error: error ? normalizeAuthError(error) : null };
  },

  verifyOtp: async (phone, token) => {
    set({ loading: true });
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    set({ loading: false });

    return { error: error ? normalizeAuthError(error) : null };
  },

  saveUserName: async (name: string) => {
    const profile = get().profile;
    if (!profile) return { error: "User not found" };

    set({ loading: true });

    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: name?.trim() || null,
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      set({ loading: false });
      return { error: "Failed to save name" };
    }

    set({ profile: data, loading: false });

    return { error: null };
  },

  saveBuilding: async (buildingId) => {
    const profile = get().profile;
    if (!profile) return { error: "User not found" };

    set({ loading: true });

    const { data, error } = await supabase
      .from("users")
      .update({
        building_id: buildingId,
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      set({ loading: false });
      return { error: "Failed to save building" };
    }

    set({ profile: data, loading: false });

    return { error: null };
  },

  initialize: async () => {
    if (get().initialized) return;

    set({ loading: true });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const authUser = session?.user ?? null;
    let profile: AppUser | null = null;

    if (authUser) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      profile = data ?? null;
    }

    set({
      authUser,
      profile,
      loading: false,
      initialized: true,
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user ?? null;
      let profile: AppUser | null = null;

      if (authUser) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        profile = data ?? null;
      }
      set({ authUser, profile });
    });
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({
      authUser: null,
      profile: null,
      loading: false,
    });
  },
}));
