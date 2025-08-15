export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      asset_history: {
        Row: {
          action: string
          asset_id: string
          id: string
          notes: string | null
          performed_by: string
          quantity_change: number | null
          timestamp: string
        }
        Insert: {
          action: string
          asset_id: string
          id?: string
          notes?: string | null
          performed_by: string
          quantity_change?: number | null
          timestamp?: string
        }
        Update: {
          action?: string
          asset_id?: string
          id?: string
          notes?: string | null
          performed_by?: string
          quantity_change?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_history_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          condition: string
          created_at: string
          id: string
          last_updated: string
          location: string | null
          name: string
          notes: string | null
          pg_property_id: string
          purchase_date: string | null
          purchase_price: number | null
          quantity: number
          status: string
          type: string
        }
        Insert: {
          condition?: string
          created_at?: string
          id?: string
          last_updated?: string
          location?: string | null
          name: string
          notes?: string | null
          pg_property_id: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number
          status?: string
          type: string
        }
        Update: {
          condition?: string
          created_at?: string
          id?: string
          last_updated?: string
          location?: string | null
          name?: string
          notes?: string | null
          pg_property_id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_pg_property_id_fkey"
            columns: ["pg_property_id"]
            isOneToOne: false
            referencedRelation: "pg_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_issues: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          location: string | null
          pg_property_id: string
          priority: string
          reported_at: string
          reported_by: string
          resolved_at: string | null
          room_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          location?: string | null
          pg_property_id: string
          priority?: string
          reported_at?: string
          reported_by: string
          resolved_at?: string | null
          room_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          pg_property_id?: string
          priority?: string
          reported_at?: string
          reported_by?: string
          resolved_at?: string | null
          room_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_issues_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_issues_pg_property_id_fkey"
            columns: ["pg_property_id"]
            isOneToOne: false
            referencedRelation: "pg_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_issues_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_issues_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_responses: {
        Row: {
          created_at: string
          id: string
          meal_id: string
          response: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_id: string
          response: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_id?: string
          response?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_responses_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          id: string
          is_active: boolean | null
          meal_type: string
          menu: string
          pg_property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date: string
          id?: string
          is_active?: boolean | null
          meal_type: string
          menu: string
          pg_property_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          is_active?: boolean | null
          meal_type?: string
          menu?: string
          pg_property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meals_pg_property_id_fkey"
            columns: ["pg_property_id"]
            isOneToOne: false
            referencedRelation: "pg_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_data: Json | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          pg_property_id: string | null
          requires_action: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_data?: Json | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          pg_property_id?: string | null
          requires_action?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_data?: Json | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          pg_property_id?: string | null
          requires_action?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_pg_property_id_fkey"
            columns: ["pg_property_id"]
            isOneToOne: false
            referencedRelation: "pg_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          pg_property_id: string | null
          status: string
          transaction_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          pg_property_id?: string | null
          status?: string
          transaction_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          pg_property_id?: string | null
          status?: string
          transaction_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_pg_property_id_fkey"
            columns: ["pg_property_id"]
            isOneToOne: false
            referencedRelation: "pg_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pg_properties: {
        Row: {
          address: string
          amenities: string[] | null
          city: string
          contact_number: string
          created_at: string
          created_by: string | null
          description: string | null
          established: string | null
          gender: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          logo: string | null
          manager_name: string
          monthly_rent: number
          name: string
          occupied_rooms: number | null
          pg_type: string | null
          pincode: string
          rating: number | null
          rules: string[] | null
          security_deposit: number
          state: string
          total_rooms: number | null
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city: string
          contact_number: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          established?: string | null
          gender?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          logo?: string | null
          manager_name: string
          monthly_rent: number
          name: string
          occupied_rooms?: number | null
          pg_type?: string | null
          pincode: string
          rating?: number | null
          rules?: string[] | null
          security_deposit: number
          state: string
          total_rooms?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string
          contact_number?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          established?: string | null
          gender?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          logo?: string | null
          manager_name?: string
          monthly_rent?: number
          name?: string
          occupied_rooms?: number | null
          pg_type?: string | null
          pincode?: string
          rating?: number | null
          rules?: string[] | null
          security_deposit?: number
          state?: string
          total_rooms?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pg_properties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_sub_role: string | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          gender: string | null
          id: string
          pg_property_id: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          admin_sub_role?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          gender?: string | null
          id: string
          pg_property_id?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          admin_sub_role?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          pg_property_id?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_assignments: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          monthly_rent: number
          pg_property_id: string
          room_id: string
          security_deposit: number | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_rent: number
          pg_property_id: string
          room_id: string
          security_deposit?: number | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_rent?: number
          pg_property_id?: string
          room_id?: string
          security_deposit?: number | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_assignments_pg_property_id_fkey"
            columns: ["pg_property_id"]
            isOneToOne: false
            referencedRelation: "pg_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          floor_number: number | null
          id: string
          images: string[] | null
          is_available: boolean | null
          occupied: number | null
          pg_property_id: string
          price: number
          room_number: string
          type: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity: number
          created_at?: string
          floor_number?: number | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          occupied?: number | null
          pg_property_id: string
          price: number
          room_number: string
          type: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          floor_number?: number | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          occupied?: number | null
          pg_property_id?: string
          price?: number
          room_number?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_pg_property_id_fkey"
            columns: ["pg_property_id"]
            isOneToOne: false
            referencedRelation: "pg_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_pg_property: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_primary_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "pg_admin" | "warden" | "guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "pg_admin", "warden", "guest"],
    },
  },
} as const
