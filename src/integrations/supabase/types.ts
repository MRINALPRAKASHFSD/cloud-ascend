export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          awarded_on: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          metric_label: string | null
          metric_value: string | null
          publish_at: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          awarded_on?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          metric_label?: string | null
          metric_value?: string | null
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          awarded_on?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          metric_label?: string | null
          metric_value?: string | null
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string | null
          created_at: string
          expires_at: string | null
          id: string
          kind: string
          pinned: boolean
          publish_at: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: string
          pinned?: boolean
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: string
          pinned?: boolean
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          email: string | null
          hours: string | null
          id: number
          map_url: string | null
          phone: string | null
          socials: Json
          updated_at: string
        }
        Insert: {
          address?: string | null
          email?: string | null
          hours?: string | null
          id?: number
          map_url?: string | null
          phone?: string | null
          socials?: Json
          updated_at?: string
        }
        Update: {
          address?: string | null
          email?: string | null
          hours?: string | null
          id?: number
          map_url?: string | null
          phone?: string | null
          socials?: Json
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          location: string | null
          publish_at: string | null
          slug: string | null
          sort_order: number
          starts_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          tag: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          publish_at?: string | null
          slug?: string | null
          sort_order?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          tag?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          publish_at?: string | null
          slug?: string | null
          sort_order?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          tag?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faculty: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          linkedin_url: string | null
          name: string
          position: string | null
          publish_at: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          position?: string | null
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          position?: string | null
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          external: boolean
          id: string
          label: string
          section: string
          sort_order: number
          updated_at: string
          url: string
          visible: boolean
        }
        Insert: {
          external?: boolean
          id?: string
          label: string
          section: string
          sort_order?: number
          updated_at?: string
          url: string
          visible?: boolean
        }
        Update: {
          external?: boolean
          id?: string
          label?: string
          section?: string
          sort_order?: number
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          captured_on: string | null
          created_at: string
          gradient: string | null
          height: number
          id: string
          image_url: string | null
          publish_at: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          captured_on?: string | null
          created_at?: string
          gradient?: string | null
          height?: number
          id?: string
          image_url?: string | null
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          captured_on?: string | null
          created_at?: string
          gradient?: string | null
          height?: number
          id?: string
          image_url?: string | null
          publish_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_stats: {
        Row: {
          id: string
          label: string
          sort_order: number
          suffix: string | null
          updated_at: string
          value: number
          visible: boolean
        }
        Insert: {
          id?: string
          label: string
          sort_order?: number
          suffix?: string | null
          updated_at?: string
          value?: number
          visible?: boolean
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
          suffix?: string | null
          updated_at?: string
          value?: number
          visible?: boolean
        }
        Relationships: []
      }
      members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          github_url: string | null
          hue: number
          id: string
          linkedin_url: string | null
          name: string
          position: string | null
          publish_at: string | null
          role_label: string
          skills: string[]
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          hue?: number
          id?: string
          linkedin_url?: string | null
          name: string
          position?: string | null
          publish_at?: string | null
          role_label?: string
          skills?: string[]
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          hue?: number
          id?: string
          linkedin_url?: string | null
          name?: string
          position?: string | null
          publish_at?: string | null
          role_label?: string
          skills?: string[]
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          description: string | null
          featured: boolean
          github_url: string | null
          gradient: string | null
          id: string
          lifecycle: string
          publish_at: string | null
          slug: string | null
          sort_order: number
          stack: string[]
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          github_url?: string | null
          gradient?: string | null
          id?: string
          lifecycle?: string
          publish_at?: string | null
          slug?: string | null
          sort_order?: number
          stack?: string[]
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          github_url?: string | null
          gradient?: string | null
          id?: string
          lifecycle?: string
          publish_at?: string | null
          slug?: string | null
          sort_order?: number
          stack?: string[]
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          author_role: string | null
          avatar_url: string | null
          created_at: string
          id: string
          publish_at: string | null
          quote: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          author: string
          author_role?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          publish_at?: string | null
          quote: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          author?: string
          author_role?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          publish_at?: string | null
          quote?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      content_status: "draft" | "published"
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
      app_role: ["admin", "editor"],
      content_status: ["draft", "published"],
    },
  },
} as const
