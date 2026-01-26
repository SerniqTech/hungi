import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  sendOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  setSession: (session) => set({ session }),

  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    try {
      set({ loading: true });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        set({
          session,
          user: session.user,
          initialized: true,
          loading: false,
        });
      } else {
        set({
          session: null,
          user: null,
          initialized: true,
          loading: false,
        });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        loading: false,
        initialized: true,
      });
    }
  },

  sendOtp: async (phone) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      set({ loading: false });
      return { error };
    }

    set({
      user: data.user,
      session: data.session,
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
      return { error };
    }

    set({
      user: data.user,
      session: data.session,
      loading: false,
    });

    return { error: null };
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      loading: false,
    });
  },
}));
