import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          sku: string | null
          category_id: string | null
          quantity: number
          min_quantity: number | null
          price: number | null
          cost: number | null
          supplier: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          sku?: string | null
          category_id?: string | null
          quantity?: number
          min_quantity?: number | null
          price?: number | null
          cost?: number | null
          supplier?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          sku?: string | null
          category_id?: string | null
          quantity?: number
          min_quantity?: number | null
          price?: number | null
          cost?: number | null
          supplier?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string | null
          type: string
          quantity: number
          reason: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          type: string
          quantity: number
          reason?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          type?: string
          quantity?: number
          reason?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
