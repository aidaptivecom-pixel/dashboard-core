'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Task {
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
}

export function useTasks(spaceId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    let query = supabase
      .from('tasks')
      .select('*')
      .order('sort_order', { ascending: true });

    if (spaceId) {
      query = query.eq('space_id', spaceId);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setTasks((data as Task[]) || []);
    }
    setLoading(false);
  }, [spaceId]);

  useEffect(() => {
    fetchTasks();

    const supabase = createClient();
    const channel = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  const createTask = async (task: { title: string; space_id?: string; due_date?: string; priority?: Task['priority'] }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: task.title,
        space_id: task.space_id || null,
        due_date: task.due_date || null,
        priority: task.priority || null,
      })
      .select()
      .single();

    if (!error && data) {
      setTasks(prev => [...prev, data as Task]);
    }
    return { data, error };
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setTasks(prev => prev.map(t => t.id === id ? data as Task : t));
    }
    return { data, error };
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return { error: 'Task not found' };

    return updateTask(id, {
      completed: !task.completed,
      completed_at: !task.completed ? new Date().toISOString() : null,
    });
  };

  const deleteTask = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
    return { error };
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return {
    tasks,
    pendingTasks,
    completedTasks,
    loading,
    error,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
