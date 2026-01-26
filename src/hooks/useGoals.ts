'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Goal = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['goals']['Update'];

export function useGoals(spaceId?: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    let query = supabase
      .from('goals')
      .select('*')
      .order('sort_order', { ascending: true });

    if (spaceId) {
      query = query.eq('space_id', spaceId);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  }, [spaceId]);

  useEffect(() => {
    fetchGoals();

    const supabase = createClient();
    const channel = supabase
      .channel('goals_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, () => {
        fetchGoals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGoals]);

  const createGoal = async (goal: Omit<GoalInsert, 'user_id'>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const insertData: GoalInsert = {
      ...goal,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('goals')
      .insert(insertData)
      .select()
      .single();

    if (!error && data) {
      setGoals(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateGoal = async (id: string, updates: GoalUpdate) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setGoals(prev => prev.map(g => g.id === id ? data : g));
    }
    return { data, error };
  };

  const deleteGoal = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (!error) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
    return { error };
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return {
    goals,
    activeGoals,
    completedGoals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
}
