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
      profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          avatar_url: string | null
          user_type: 'client' | 'realtor' | 'admin'
          whatsapp: string | null
          telegram: string | null
          address: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'client' | 'realtor' | 'admin'
          whatsapp?: string | null
          telegram?: string | null
          address?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'client' | 'realtor' | 'admin'
          whatsapp?: string | null
          telegram?: string | null
          address?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          price_type: 'day' | 'month' | 'year'
          location: string
          district: string
          bedrooms: number
          bathrooms: number
          area: number
          images: string[]
          features: string[]
          realtor_id: string
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          price_type?: 'day' | 'month' | 'year'
          location: string
          district: string
          bedrooms: number
          bathrooms: number
          area: number
          images?: string[]
          features?: string[]
          realtor_id: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          price_type?: 'day' | 'month' | 'year'
          location?: string
          district?: string
          bedrooms?: number
          bathrooms?: number
          area?: number
          images?: string[]
          features?: string[]
          realtor_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          property_id: string
          client_id: string
          realtor_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          client_id: string
          realtor_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          client_id?: string
          realtor_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'client' | 'realtor' | 'admin'
      price_type: 'day' | 'month' | 'year'
      property_status: 'pending' | 'approved' | 'rejected'
    }
  }
}