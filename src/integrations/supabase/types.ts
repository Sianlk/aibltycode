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
      admin_emails: {
        Row: {
          created_at: string | null
          email: string
        }
        Insert: {
          created_at?: string | null
          email: string
        }
        Update: {
          created_at?: string | null
          email?: string
        }
        Relationships: []
      }
      avatar_items: {
        Row: {
          category: string
          created_at: string | null
          icon: string | null
          id: string
          name: string
          rarity: string | null
          unlock_requirement: string | null
          xp_cost: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          rarity?: string | null
          unlock_requirement?: string | null
          xp_cost?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          rarity?: string | null
          unlock_requirement?: string | null
          xp_cost?: number | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          xp_required: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          xp_required?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          xp_required?: number | null
        }
        Relationships: []
      }
      battle_rooms: {
        Row: {
          created_at: string | null
          difficulty: number | null
          ended_at: string | null
          game_type: string
          host_id: string | null
          host_score: number | null
          id: string
          opponent_id: string | null
          opponent_score: number | null
          room_code: string
          spectator_count: number | null
          started_at: string | null
          status: string
          total_rounds: number | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: number | null
          ended_at?: string | null
          game_type?: string
          host_id?: string | null
          host_score?: number | null
          id?: string
          opponent_id?: string | null
          opponent_score?: number | null
          room_code: string
          spectator_count?: number | null
          started_at?: string | null
          status?: string
          total_rounds?: number | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty?: number | null
          ended_at?: string | null
          game_type?: string
          host_id?: string | null
          host_score?: number | null
          id?: string
          opponent_id?: string | null
          opponent_score?: number | null
          room_code?: string
          spectator_count?: number | null
          started_at?: string | null
          status?: string
          total_rounds?: number | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_rooms_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_rooms_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_rounds: {
        Row: {
          correct_answer: number
          created_at: string | null
          host_answer: number | null
          host_time_ms: number | null
          id: string
          opponent_answer: number | null
          opponent_time_ms: number | null
          question: Json
          room_id: string
          round_number: number
          round_winner: string | null
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          host_answer?: number | null
          host_time_ms?: number | null
          id?: string
          opponent_answer?: number | null
          opponent_time_ms?: number | null
          question: Json
          room_id: string
          round_number: number
          round_winner?: string | null
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          host_answer?: number | null
          host_time_ms?: number | null
          id?: string
          opponent_answer?: number | null
          opponent_time_ms?: number | null
          question?: Json
          room_id?: string
          round_number?: number
          round_winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_rounds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "battle_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_spectators: {
        Row: {
          id: string
          joined_at: string | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_spectators_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "battle_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_spectators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_stats: {
        Row: {
          avg_answer_time_ms: number | null
          best_win_streak: number | null
          current_win_streak: number | null
          draws: number | null
          id: string
          losses: number | null
          rating: number | null
          total_rounds_won: number | null
          updated_at: string | null
          user_id: string
          wins: number | null
        }
        Insert: {
          avg_answer_time_ms?: number | null
          best_win_streak?: number | null
          current_win_streak?: number | null
          draws?: number | null
          id?: string
          losses?: number | null
          rating?: number | null
          total_rounds_won?: number | null
          updated_at?: string | null
          user_id: string
          wins?: number | null
        }
        Update: {
          avg_answer_time_ms?: number | null
          best_win_streak?: number | null
          current_win_streak?: number | null
          draws?: number | null
          id?: string
          losses?: number | null
          rating?: number | null
          total_rounds_won?: number | null
          updated_at?: string | null
          user_id?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bug_reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          page_url: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          page_url?: string | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          page_url?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      challenge_completions: {
        Row: {
          attempts: number | null
          best_time_ms: number | null
          challenge_id: string
          completed_at: string | null
          id: string
          passed: boolean | null
          user_code: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          best_time_ms?: number | null
          challenge_id: string
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          user_code: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          best_time_ms?: number | null
          challenge_id?: string
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          user_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "code_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "safe_code_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_progress: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress: Json | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: Json | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          active_from: string | null
          active_until: string | null
          created_at: string | null
          description: string | null
          id: string
          requirements: Json | null
          reward_item_id: string | null
          reward_xp: number | null
          title: string
          type: string
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          requirements?: Json | null
          reward_item_id?: string | null
          reward_xp?: number | null
          title: string
          type: string
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          requirements?: Json | null
          reward_item_id?: string | null
          reward_xp?: number | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_reward_item_id_fkey"
            columns: ["reward_item_id"]
            isOneToOne: false
            referencedRelation: "avatar_items"
            referencedColumns: ["id"]
          },
        ]
      }
      code_challenges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          difficulty: number | null
          expected_output: string | null
          hints: Json | null
          id: string
          solution_code: string | null
          starter_code: string | null
          test_cases: Json | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          difficulty?: number | null
          expected_output?: string | null
          hints?: Json | null
          id?: string
          solution_code?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          difficulty?: number | null
          expected_output?: string | null
          hints?: Json | null
          id?: string
          solution_code?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      code_projects: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          language: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          accuracy: number | null
          created_at: string | null
          game_type: string
          id: string
          score: number | null
          time_taken: number | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          game_type: string
          id?: string
          score?: number | null
          time_taken?: number | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          game_type?: string
          id?: string
          score?: number | null
          time_taken?: number | null
          user_id?: string
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          best_streak: number | null
          current_streak: number | null
          games_played: number | null
          id: string
          lessons_completed: number | null
          opt_in: boolean | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_streak?: number | null
          current_streak?: number | null
          games_played?: number | null
          id?: string
          lessons_completed?: number | null
          opt_in?: boolean | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          best_streak?: number | null
          current_streak?: number | null
          games_played?: number | null
          id?: string
          lessons_completed?: number | null
          opt_in?: boolean | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string | null
          difficulty: string | null
          example_code: string | null
          id: string
          module_id: string | null
          order_index: number | null
          recap_points: string[] | null
          story: string | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          difficulty?: string | null
          example_code?: string | null
          id?: string
          module_id?: string | null
          order_index?: number | null
          recap_points?: string[] | null
          story?: string | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          difficulty?: string | null
          example_code?: string | null
          id?: string
          module_id?: string | null
          order_index?: number | null
          recap_points?: string[] | null
          story?: string | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          order_index: number | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number | null
          title?: string
        }
        Relationships: []
      }
      parental_pins: {
        Row: {
          created_at: string | null
          hashed_pin: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hashed_pin: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          hashed_pin?: string
          user_id?: string
        }
        Relationships: []
      }
      parental_unlock_log: {
        Row: {
          attempted_at: string
          id: string
          success: boolean
          user_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          success?: boolean
          user_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          success?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parental_unlock_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_config: Json | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          last_activity_date: string | null
          mode: string | null
          sound_enabled: boolean | null
          streak_days: number | null
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          avatar_config?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          last_activity_date?: string | null
          mode?: string | null
          sound_enabled?: boolean | null
          streak_days?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          avatar_config?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          last_activity_date?: string | null
          mode?: string | null
          sound_enabled?: boolean | null
          streak_days?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      spaced_repetition: {
        Row: {
          created_at: string | null
          ease_factor: number | null
          id: string
          interval_days: number | null
          lesson_id: string | null
          next_review_at: string | null
          question_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          lesson_id?: string | null
          next_review_at?: string | null
          question_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          lesson_id?: string | null
          next_review_at?: string | null
          question_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaced_repetition_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          is_grandfathered: boolean | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_grandfathered?: boolean | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_grandfathered?: boolean | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tutor_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          topic: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "tutor_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_avatar_items: {
        Row: {
          id: string
          item_id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_avatar_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "avatar_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          attempts: number | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string | null
          lesson_key: string | null
          module_id: string | null
          module_key: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          lesson_key?: string | null
          module_id?: string | null
          module_key?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          lesson_key?: string | null
          module_id?: string | null
          module_key?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      battle_leaderboard: {
        Row: {
          best_win_streak: number | null
          current_win_streak: number | null
          display_name: string | null
          draws: number | null
          id: string | null
          losses: number | null
          rating: number | null
          wins: number | null
        }
        Relationships: []
      }
      safe_code_challenges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: number | null
          hints: Json | null
          id: string | null
          starter_code: string | null
          test_cases: Json | null
          title: string | null
          xp_reward: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: number | null
          hints?: Json | null
          id?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title?: string | null
          xp_reward?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: number | null
          hints?: Json | null
          id?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_badge: { Args: { p_badge_id: string }; Returns: boolean }
      clear_parental_pin: { Args: never; Returns: boolean }
      finalize_battle: {
        Args: {
          p_host_score: number
          p_opponent_score: number
          p_room_id: string
          p_winner_id: string
        }
        Returns: undefined
      }
      get_safe_battle_round: { Args: { p_round_id: string }; Returns: Json }
      has_parental_pin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_email: { Args: { email: string }; Returns: boolean }
      set_parental_pin: { Args: { pin_value: string }; Returns: boolean }
      submit_battle_answer: {
        Args: { p_answer: number; p_round_id: string; p_time_ms: number }
        Returns: undefined
      }
      unlock_avatar_item: { Args: { p_item_id: string }; Returns: boolean }
      update_leaderboard_stats: {
        Args: {
          p_games_delta?: number
          p_lessons_delta?: number
          p_xp_delta?: number
        }
        Returns: undefined
      }
      verify_parental_pin: { Args: { pin_attempt: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
