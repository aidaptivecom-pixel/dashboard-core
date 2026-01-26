'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface FocusSession {
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
}

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
      setSessions((data as FocusSession[]) || []);
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

  const startSession = async (session: { type: FocusSession['type']; duration_minutes: number }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: user.id,
        type: session.type,
        duration_minutes: session.duration_minutes,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      setSessions(prev => [data as FocusSession, ...prev]);
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
      setSessions(prev => prev.map(s => s.id === id ? data as FocusSession : s));
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
