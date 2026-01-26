'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type FocusSession = Database['public']['Tables']['focus_sessions']['Row'];
type FocusSessionInsert = Database['public']['Tables']['focus_sessions']['Insert'];

export function useFocusSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) {
      setError(error.message);
    } else {
      setSessions(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();

    const supabase = createClient();
    const channel = supabase
      .channel('focus_sessions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'focus_sessions' }, () => {
        fetchSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);

  const startSession = async (session: Omit<FocusSessionInsert, 'user_id'>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const insertData: FocusSessionInsert = {
      ...session,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert(insertData)
      .select()
      .single();

    if (!error && data) {
      setSessions(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const endSession = async (id: string, completed: boolean) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('focus_sessions')
      .update({
        ended_at: new Date().toISOString(),
        completed,
      })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setSessions(prev => prev.map(s => s.id === id ? data : s));
    }
    return { data, error };
  };

  const todaySessions = sessions.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.started_at).toDateString() === today;
  });

  const todayFocusMinutes = todaySessions
    .filter(s => s.type === 'focus' && s.completed)
    .reduce((acc, s) => acc + s.duration_minutes, 0);

  const todayCompletedSessions = todaySessions.filter(s => s.type === 'focus' && s.completed).length;

  return {
    sessions,
    loading,
    error,
    startSession,
    endSession,
    todayFocusMinutes,
    todayCompletedSessions,
    refetch: fetchSessions,
  };
}
