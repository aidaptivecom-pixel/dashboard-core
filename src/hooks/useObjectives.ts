'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Objective = Database['public']['Tables']['objectives']['Row'];
type ObjectiveInsert = Database['public']['Tables']['objectives']['Insert'];
type ObjectiveUpdate = Database['public']['Tables']['objectives']['Update'];

export function useObjectives(goalId?: string) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectives = useCallback(async () => {
    if (!goalId) {
      setObjectives([]);
      setLoading(false);
      return;
    }
    
    const supabase = createClient();
    setLoading(true);
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('goal_id', goalId)
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setObjectives(data || []);
    }
    setLoading(false);
  }, [goalId]);

  useEffect(() => {
    fetchObjectives();

    const supabase = createClient();
    const channel = supabase
      .channel(`objectives_${goalId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'objectives' }, () => {
        fetchObjectives();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchObjectives, goalId]);

  const createObjective = async (objective: Omit<ObjectiveInsert, 'goal_id'>) => {
    if (!goalId) return { error: 'No goal ID' };

    const supabase = createClient();
    const insertData: ObjectiveInsert = {
      ...objective,
      goal_id: goalId,
    };

    const { data, error } = await supabase
      .from('objectives')
      .insert(insertData)
      .select()
      .single();

    if (!error && data) {
      setObjectives(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateObjective = async (id: string, updates: ObjectiveUpdate) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('objectives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setObjectives(prev => prev.map(o => o.id === id ? data : o));
    }
    return { data, error };
  };

  const deleteObjective = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('objectives')
      .delete()
      .eq('id', id);

    if (!error) {
      setObjectives(prev => prev.filter(o => o.id !== id));
    }
    return { error };
  };

  return {
    objectives,
    loading,
    error,
    createObjective,
    updateObjective,
    deleteObjective,
    refetch: fetchObjectives,
  };
}
