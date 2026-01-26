'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Objective {
  id: string;
  goal_id: string;
  title: string;
  progress: number | null;
  due_date: string | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

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
      setObjectives((data as Objective[]) || []);
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

  const createObjective = async (objective: { title: string; due_date?: string }) => {
    if (!goalId) return { error: 'No goal ID' };

    const supabase = createClient();
    const { data, error } = await supabase
      .from('objectives')
      .insert({
        goal_id: goalId,
        title: objective.title,
        due_date: objective.due_date || null,
      })
      .select()
      .single();

    if (!error && data) {
      setObjectives(prev => [...prev, data as Objective]);
    }
    return { data, error };
  };

  const updateObjective = async (id: string, updates: Partial<Objective>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('objectives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setObjectives(prev => prev.map(o => o.id === id ? data as Objective : o));
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
