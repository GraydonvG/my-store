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
      product_image_data: {
        Row: {
          created_at: string
          file_name: string
          id: string
          image_url: string
          product_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          image_url: string
          product_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          image_url?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_image_data_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          delivery_info: string
          description: string
          id: string
          image_data: Json[]
          name: string
          on_sale: boolean
          price: number
          sale_percentage: number
          sizes: string[]
        }
        Insert: {
          category: string
          created_at?: string
          delivery_info: string
          description: string
          id?: string
          image_data: Json[]
          name: string
          on_sale?: boolean
          price: number
          sale_percentage: number
          sizes: string[]
        }
        Update: {
          category?: string
          created_at?: string
          delivery_info?: string
          description?: string
          id?: string
          image_data?: Json[]
          name?: string
          on_sale?: boolean
          price?: number
          sale_percentage?: number
          sizes?: string[]
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string
          first_name: string | null
          id: string
          is_admin: boolean
          last_name: string | null
        }
        Insert: {
          email: string
          first_name?: string | null
          id: string
          is_admin?: boolean
          last_name?: string | null
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
