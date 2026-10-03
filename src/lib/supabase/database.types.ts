export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          primary_email: string;
          email_verified_at: string | null;
          status: 'pending_verification' | 'active' | 'suspended' | 'deactivated' | 'deleted';
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          primary_email: string;
          email_verified_at?: string | null;
          status?: 'pending_verification' | 'active' | 'suspended' | 'deactivated' | 'deleted';
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          primary_email?: string;
          email_verified_at?: string | null;
          status?: 'pending_verification' | 'active' | 'suspended' | 'deactivated' | 'deleted';
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      user_auth_identities: {
        Row: {
          id: string;
          user_id: string;
          provider: 'email' | 'google' | 'apple' | 'github' | 'facebook';
          provider_user_id: string;
          provider_email: string | null;
          password_hash: string | null;
          password_updated_at: string | null;
          is_primary: boolean;
          linked_at: string;
          last_used_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: 'email' | 'google' | 'apple' | 'github' | 'facebook';
          provider_user_id: string;
          provider_email?: string | null;
          password_hash?: string | null;
          password_updated_at?: string | null;
          is_primary?: boolean;
          linked_at?: string;
          last_used_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: 'email' | 'google' | 'apple' | 'github' | 'facebook';
          provider_user_id?: string;
          provider_email?: string | null;
          password_hash?: string | null;
          password_updated_at?: string | null;
          is_primary?: boolean;
          linked_at?: string;
          last_used_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          user_id: string;
          display_name: string;
          username: string | null;
          avatar_file_id: string | null;
          avatar_url: string | null;
          locale: string | null;
          timezone: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          username?: string | null;
          avatar_file_id?: string | null;
          avatar_url?: string | null;
          locale?: string | null;
          timezone?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          username?: string | null;
          avatar_file_id?: string | null;
          avatar_url?: string | null;
          locale?: string | null;
          timezone?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_onboarding: {
        Row: {
          user_id: string;
          current_step: string | null;
          completed_steps: Json;
          skipped_steps: Json;
          completion_status: 'not_started' | 'in_progress' | 'completed';
          flow_version: string;
          started_at: string | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_step?: string | null;
          completed_steps?: Json;
          skipped_steps?: Json;
          completion_status?: 'not_started' | 'in_progress' | 'completed';
          flow_version?: string;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          current_step?: string | null;
          completed_steps?: Json;
          skipped_steps?: Json;
          completion_status?: 'not_started' | 'in_progress' | 'completed';
          flow_version?: string;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          kind: 'personal' | 'team' | 'organization';
          settings: Json;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          kind?: 'personal' | 'team' | 'organization';
          settings?: Json;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
          kind?: 'personal' | 'team' | 'organization';
          settings?: Json;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          invited_by: string | null;
          status: 'invited' | 'active' | 'removed';
          joined_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          invited_by?: string | null;
          status?: 'invited' | 'active' | 'removed';
          joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          invited_by?: string | null;
          status?: 'invited' | 'active' | 'removed';
          joined_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          created_by: string;
          name: string;
          slug: string;
          description: string | null;
          status:
            | 'draft'
            | 'planning'
            | 'plan_approved'
            | 'in_development'
            | 'completed'
            | 'archived';
          visibility: 'private' | 'workspace';
          settings: Json;
          metadata: Json;
          last_activity_at: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          created_by: string;
          name: string;
          slug: string;
          description?: string | null;
          status?:
            | 'draft'
            | 'planning'
            | 'plan_approved'
            | 'in_development'
            | 'completed'
            | 'archived';
          visibility?: 'private' | 'workspace';
          settings?: Json;
          metadata?: Json;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          created_by?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          status?:
            | 'draft'
            | 'planning'
            | 'plan_approved'
            | 'in_development'
            | 'completed'
            | 'archived';
          visibility?: 'private' | 'workspace';
          settings?: Json;
          metadata?: Json;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          added_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          added_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: 'owner' | 'editor' | 'viewer';
          added_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      user_auth_identities_public: {
        Row: {
          id: string | null;
          user_id: string | null;
          provider: string | null;
          provider_email: string | null;
          is_primary: boolean | null;
          linked_at: string | null;
          last_used_at: string | null;
          created_at: string | null;
        };
        Relationships: [];
      };
      user_profiles_public: {
        Row: {
          user_id: string | null;
          display_name: string | null;
          avatar_file_id: string | null;
          avatar_url: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
