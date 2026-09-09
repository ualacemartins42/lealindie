export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          whatsapp: string | null
          message: string
          created_at: string
        }
        Insert: {
          name: string
          email: string
          subject: string
          whatsapp?: string | null
          message: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      page_views: {
        Row: {
          id: number
          visitor_hash: string
          path: string
          created_at: string
        }
        Insert: {
          visitor_hash: string
          path?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      project_likes: {
        Row: {
          id: number
          project_slug: string
          visitor_hash: string
          created_at: string
        }
        Insert: {
          project_slug: string
          visitor_hash: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          whatsapp: string | null
          message: string
          visitor_hash: string | null
          created_at: string
        }
        Insert: {
          name: string
          email: string
          subject?: string
          whatsapp?: string | null
          message: string
          visitor_hash?: string | null
        }
        Update: Record<string, never>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      register_page_view: {
        Args: { p_visitor_hash: string; p_path?: string }
        Returns: number
      }
      toggle_project_like: {
        Args: { p_project_slug: string; p_visitor_hash: string }
        Returns: Json
      }
      get_site_metrics: {
        Args: { p_visitor_hash?: string }
        Returns: Json
      }
      submit_contact: {
        Args: {
          p_name: string
          p_email: string
          p_subject: string
          p_message: string
          p_visitor_hash?: string
          p_honeypot?: string
          p_whatsapp?: string
        }
        Returns: Json
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
