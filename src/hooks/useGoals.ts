'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Goal {
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
}

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
      setGoals((data as Goal[]) || []);
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

  const createGoal = async (goal: { title: string; description?: string; space_id?: string; color?: string; due_date?: string }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: goal.title,
        description: goal.description || null,
        space_id: goal.space_id || null,
        color: goal.color || null,
        due_date: goal.due_date || null,
        status: 'active',
        progress: 0,
      })
      .select()
      .single();

    if (!error && data) {
      setGoals(prev => [...prev, data as Goal]);
    }
    return { data, error };
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setGoals(prev => prev.map(g => g.id === id ? data as Goal : g));
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
