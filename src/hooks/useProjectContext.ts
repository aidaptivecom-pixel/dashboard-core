import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ProjectContext {
  id: string;
  space_id: string;
  status: string;
  summary: string | null;
  current_phase: string | null;
  next_milestone: string | null;
  next_milestone_date: string | null;
  next_actions: Array<{
    action: string;
    owner: string;
    due_date?: string;
    priority?: string;
  }>;
  client_name: string | null;
  client_contact: {
    phone?: string;
    email?: string;
    telegram?: string;
    preferred_channel?: string;
  };
  last_client_update: string | null;
  comms_log: Array<{
    date: string;
    channel: string;
    summary: string;
    outcome?: string;
    by: string;
  }>;
  updated_at: string | null;
  updated_by: string | null;
}

export function useProjectContext(spaceId: string) {
  const [context, setContext] = useState<ProjectContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      const supabase = createClient();
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('project_context')
        .select('*')
        .eq('space_id', spaceId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError(fetchError.message);
      }
      
      setContext(data as ProjectContext | null);
      setLoading(false);
    };

    if (spaceId) {
      fetchContext();
    }
  }, [spaceId]);

  const updateContext = async (updates: Partial<ProjectContext>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    if (context) {
      // Update existing
      const { data, error } = await supabase
        .from('project_context')
        .update({ ...updates, updated_by: 'dashboard', updated_at: new Date().toISOString() })
        .eq('id', context.id)
        .select()
        .single();

      if (!error && data) {
        setContext(data as ProjectContext);
      }
      return { data, error };
    } else {
      // Create new
      const { data, error } = await supabase
        .from('project_context')
        .insert({ 
          space_id: spaceId, 
          ...updates, 
          updated_by: 'dashboard' 
        })
        .select()
        .single();

      if (!error && data) {
        setContext(data as ProjectContext);
      }
      return { data, error };
    }
  };

  const addNextAction = async (action: { action: string; owner: string; due_date?: string; priority?: string }) => {
    const currentActions = context?.next_actions || [];
    return updateContext({ next_actions: [...currentActions, action] as any });
  };

  const removeNextAction = async (index: number) => {
    const currentActions = context?.next_actions || [];
    const newActions = currentActions.filter((_, i) => i !== index);
    return updateContext({ next_actions: newActions as any });
  };

  const addCommsLog = async (entry: { date: string; channel: string; summary: string; outcome?: string; by: string }) => {
    const currentLog = context?.comms_log || [];
    return updateContext({ 
      comms_log: [entry, ...currentLog].slice(0, 20) as any, // Keep last 20
      last_client_update: entry.date
    });
  };

  return {
    context,
    loading,
    error,
    updateContext,
    addNextAction,
    removeNextAction,
    addCommsLog,
  };
}
