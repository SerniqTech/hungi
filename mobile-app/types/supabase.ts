export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      building_settings: {
        Row: {
          admin_skip_cutoff_time: string;
          building_id: string;
          delivery_end_time: string;
          delivery_start_time: string;
          skip_cutoff_time: string;
        };
        Insert: {
          admin_skip_cutoff_time: string;
          building_id: string;
          delivery_end_time: string;
          delivery_start_time: string;
          skip_cutoff_time: string;
        };
        Update: {
          admin_skip_cutoff_time?: string;
          building_id?: string;
          delivery_end_time?: string;
          delivery_start_time?: string;
          skip_cutoff_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "building_settings_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: true;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
        ];
      };
      buildings: {
        Row: {
          active: boolean | null;
          address: string | null;
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          active?: boolean | null;
          address?: string | null;
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          active?: boolean | null;
          address?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      menu_availability: {
        Row: {
          available: boolean | null;
          building_id: string;
          date: string;
          id: string;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          vendor_id: string;
        };
        Insert: {
          available?: boolean | null;
          building_id: string;
          date: string;
          id?: string;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          vendor_id: string;
        };
        Update: {
          available?: boolean | null;
          building_id?: string;
          date?: string;
          id?: string;
          plan_type?: Database["public"]["Enums"]["plan_type_enum"];
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_availability_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_availability_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_overrides: {
        Row: {
          created_at: string | null;
          date: string;
          description: string | null;
          id: string;
          image: string | null;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          title: string;
          vendor_id: string;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          title: string;
          vendor_id: string;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          plan_type?: Database["public"]["Enums"]["plan_type_enum"];
          title?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_overrides_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string | null;
          id: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          status: Database["public"]["Enums"]["payment_status_enum"] | null;
          subscription_id: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status_enum"] | null;
          subscription_id: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status_enum"] | null;
          subscription_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subscription_instances: {
        Row: {
          building_id: string;
          created_at: string | null;
          date: string;
          id: string;
          locked: boolean | null;
          menu_snapshot: Json;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          skipped_by: Database["public"]["Enums"]["skipped_by_enum"] | null;
          status: Database["public"]["Enums"]["instance_status_enum"] | null;
          subscription_id: string;
        };
        Insert: {
          building_id: string;
          created_at?: string | null;
          date: string;
          id?: string;
          locked?: boolean | null;
          menu_snapshot: Json;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          skipped_by?: Database["public"]["Enums"]["skipped_by_enum"] | null;
          status?: Database["public"]["Enums"]["instance_status_enum"] | null;
          subscription_id: string;
        };
        Update: {
          building_id?: string;
          created_at?: string | null;
          date?: string;
          id?: string;
          locked?: boolean | null;
          menu_snapshot?: Json;
          plan_type?: Database["public"]["Enums"]["plan_type_enum"];
          skipped_by?: Database["public"]["Enums"]["skipped_by_enum"] | null;
          status?: Database["public"]["Enums"]["instance_status_enum"] | null;
          subscription_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscription_instances_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscription_instances_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
        ];
      };
      subscription_plans: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          duration_days: number;
          id: string;
          meal_type: Database["public"]["Enums"]["meal_type_enum"];
          name: string;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          price: number;
          vendor_id: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          duration_days: number;
          id?: string;
          meal_type: Database["public"]["Enums"]["meal_type_enum"];
          name: string;
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          price: number;
          vendor_id: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          duration_days?: number;
          id?: string;
          meal_type?: Database["public"]["Enums"]["meal_type_enum"];
          name?: string;
          plan_type?: Database["public"]["Enums"]["plan_type_enum"];
          price?: number;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscription_plans_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          auto_renew: boolean | null;
          building_id: string;
          cancellation_requested: boolean | null;
          created_at: string | null;
          end_date: string;
          id: string;
          plan_id: string;
          refund_status:
            | Database["public"]["Enums"]["refund_status_enum"]
            | null;
          start_date: string;
          status:
            | Database["public"]["Enums"]["subscription_status_enum"]
            | null;
          user_id: string;
          vendor_id: string;
        };
        Insert: {
          auto_renew?: boolean | null;
          building_id: string;
          cancellation_requested?: boolean | null;
          created_at?: string | null;
          end_date: string;
          id?: string;
          plan_id: string;
          refund_status?:
            | Database["public"]["Enums"]["refund_status_enum"]
            | null;
          start_date: string;
          status?:
            | Database["public"]["Enums"]["subscription_status_enum"]
            | null;
          user_id: string;
          vendor_id: string;
        };
        Update: {
          auto_renew?: boolean | null;
          building_id?: string;
          cancellation_requested?: boolean | null;
          created_at?: string | null;
          end_date?: string;
          id?: string;
          plan_id?: string;
          refund_status?:
            | Database["public"]["Enums"]["refund_status_enum"]
            | null;
          start_date?: string;
          status?:
            | Database["public"]["Enums"]["subscription_status_enum"]
            | null;
          user_id?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "subscription_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          building_id: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          onboarding_completed: boolean | null;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          building_id?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          onboarding_completed?: boolean | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          building_id?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          onboarding_completed?: boolean | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [
          {
            foreignKeyName: "users_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
        ];
      };
      vendor_buildings: {
        Row: {
          active: boolean | null;
          building_id: string;
          id: string;
          vendor_id: string;
        };
        Insert: {
          active?: boolean | null;
          building_id: string;
          id?: string;
          vendor_id: string;
        };
        Update: {
          active?: boolean | null;
          building_id?: string;
          id?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vendor_buildings_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vendor_buildings_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      vendors: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      weekly_menu_templates: {
        Row: {
          created_at: string | null;
          day_of_week: number;
          description: string | null;
          id: string;
          image: string | null;
          meal_type: Database["public"]["Enums"]["meal_type_enum"];
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          title: string;
          vendor_id: string;
        };
        Insert: {
          created_at?: string | null;
          day_of_week: number;
          description?: string | null;
          id?: string;
          image?: string | null;
          meal_type: Database["public"]["Enums"]["meal_type_enum"];
          plan_type: Database["public"]["Enums"]["plan_type_enum"];
          title: string;
          vendor_id: string;
        };
        Update: {
          created_at?: string | null;
          day_of_week?: number;
          description?: string | null;
          id?: string;
          image?: string | null;
          meal_type?: Database["public"]["Enums"]["meal_type_enum"];
          plan_type?: Database["public"]["Enums"]["plan_type_enum"];
          title?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "weekly_menu_templates_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_my_role: {
        Args: never;
        Returns: Database["public"]["Enums"]["user_role"];
      };
    };
    Enums: {
      instance_status_enum: "scheduled" | "skipped" | "delivered" | "cancelled";
      meal_type_enum: "lunch";
      payment_status_enum: "pending" | "paid" | "failed";
      plan_type_enum: "veg" | "non_veg";
      refund_status_enum:
        | "none"
        | "pending"
        | "approved"
        | "rejected"
        | "refunded";
      skipped_by_enum: "user" | "admin";
      subscription_status_enum:
        | "pending"
        | "active"
        | "paused"
        | "cancelled"
        | "completed";
      user_role: "customer" | "vendor" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      instance_status_enum: ["scheduled", "skipped", "delivered", "cancelled"],
      meal_type_enum: ["lunch"],
      payment_status_enum: ["pending", "paid", "failed"],
      plan_type_enum: ["veg", "non_veg"],
      refund_status_enum: [
        "none",
        "pending",
        "approved",
        "rejected",
        "refunded",
      ],
      skipped_by_enum: ["user", "admin"],
      subscription_status_enum: [
        "pending",
        "active",
        "paused",
        "cancelled",
        "completed",
      ],
      user_role: ["customer", "vendor", "admin"],
    },
  },
} as const;
