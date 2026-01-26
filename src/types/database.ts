export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          avatar_url: string | null;
          timezone: string | null;
          language: string | null;
          theme: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          timezone?: string | null;
          language?: string | null;
          theme?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          timezone?: string | null;
          language?: string | null;
          theme?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      spaces: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string | null;
          color: string | null;
          description: string | null;
          is_default: boolean | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string | null;
          color?: string | null;
          description?: string | null;
          is_default?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          icon?: string | null;
          color?: string | null;
          description?: string | null;
          is_default?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      captures: {
        Row: {
          id: string;
          user_id: string;
          type: 'note' | 'voice' | 'image' | 'link' | 'idea';
          content: string;
          transcription: string | null;
          image_url: string | null;
          suggested_space_id: string | null;
          processed: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'note' | 'voice' | 'image' | 'link' | 'idea';
          content: string;
          transcription?: string | null;
          image_url?: string | null;
          suggested_space_id?: string | null;
          processed?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'note' | 'voice' | 'image' | 'link' | 'idea';
          content?: string;
          transcription?: string | null;
          image_url?: string | null;
          suggested_space_id?: string | null;
          processed?: boolean | null;
          created_at?: string | null;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          space_id: string | null;
          title: string;
          description: string | null;
          color: string | null;
          progress: number | null;
          due_date: string | null;
          status: 'active' | 'completed' | 'paused' | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          space_id?: string | null;
          title: string;
          description?: string | null;
          color?: string | null;
          progress?: number | null;
          due_date?: string | null;
          status?: 'active' | 'completed' | 'paused' | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          space_id?: string | null;
          title?: string;
          description?: string | null;
          color?: string | null;
          progress?: number | null;
          due_date?: string | null;
          status?: 'active' | 'completed' | 'paused' | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      objectives: {
        Row: {
          id: string;
          goal_id: string;
          title: string;
          progress: number | null;
          due_date: string | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          goal_id: string;
          title: string;
          progress?: number | null;
          due_date?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          goal_id?: string;
          title?: string;
          progress?: number | null;
          due_date?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          space_id: string | null;
          objective_id: string | null;
          title: string;
          description: string | null;
          completed: boolean | null;
          completed_at: string | null;
          due_date: string | null;
          due_time: string | null;
          priority: 'low' | 'medium' | 'high' | 'urgent' | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          space_id?: string | null;
          objective_id?: string | null;
          title: string;
          description?: string | null;
          completed?: boolean | null;
          completed_at?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          space_id?: string | null;
          objective_id?: string | null;
          title?: string;
          description?: string | null;
          completed?: boolean | null;
          completed_at?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          space_id: string | null;
          type: 'focus' | 'short_break' | 'long_break';
          duration_minutes: number;
          started_at: string;
          ended_at: string | null;
          completed: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          space_id?: string | null;
          type: 'focus' | 'short_break' | 'long_break';
          duration_minutes: number;
          started_at: string;
          ended_at?: string | null;
          completed?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          space_id?: string | null;
          type?: 'focus' | 'short_break' | 'long_break';
          duration_minutes?: number;
          started_at?: string;
          ended_at?: string | null;
          completed?: boolean | null;
          created_at?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          space_id: string | null;
          title: string;
          description: string | null;
          type: 'task' | 'meeting' | 'call' | 'deadline' | 'reminder' | null;
          date: string;
          start_time: string | null;
          end_time: string | null;
          all_day: boolean | null;
          color: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          space_id?: string | null;
          title: string;
          description?: string | null;
          type?: 'task' | 'meeting' | 'call' | 'deadline' | 'reminder' | null;
          date: string;
          start_time?: string | null;
          end_time?: string | null;
          all_day?: boolean | null;
          color?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          space_id?: string | null;
          title?: string;
          description?: string | null;
          type?: 'task' | 'meeting' | 'call' | 'deadline' | 'reminder' | null;
          date?: string;
          start_time?: string | null;
          end_time?: string | null;
          all_day?: boolean | null;
          color?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          space_id: string;
          title: string;
          content: string | null;
          icon: string | null;
          is_pinned: boolean | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          space_id: string;
          title: string;
          content?: string | null;
          icon?: string | null;
          is_pinned?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          space_id?: string;
          title?: string;
          content?: string | null;
          icon?: string | null;
          is_pinned?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
