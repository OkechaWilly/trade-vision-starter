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
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious' | null
          tags: string[] | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          mood?: 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious' | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          mood?: 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious' | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trades: {
        Row: {
          id: string
          user_id: string
          date: string
          pair: string
          entry: number
          exit: number | null
          position_size: number
          risk: number
          reward: number
          pnl: number | null
          rr: number | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          pair: string
          entry: number
          exit?: number | null
          position_size: number
          risk: number
          reward: number
          pnl?: number | null
          rr?: number | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          pair?: string
          entry?: number
          exit?: number | null
          position_size?: number
          risk?: number
          reward?: number
          pnl?: number | null
          rr?: number | null
          note?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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

export type JournalEntry = Database['public']['Tables']['journal_entries']['Row']
export type NewJournalEntry = Database['public']['Tables']['journal_entries']['Insert']
export type UpdateJournalEntry = Database['public']['Tables']['journal_entries']['Update']