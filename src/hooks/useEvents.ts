'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Event {
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
}

export function useEvents(dateRange?: { start: string; end: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (dateRange) {
      query = query.gte('date', dateRange.start).lte('date', dateRange.end);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setEvents((data as Event[]) || []);
    }
    setLoading(false);
  }, [dateRange]);

  useEffect(() => {
    fetchEvents();

    const supabase = createClient();
    const channel = supabase
      .channel('events_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const createEvent = async (event: { title: string; date: string; start_time?: string; end_time?: string; type?: Event['type'] }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        title: event.title,
        date: event.date,
        start_time: event.start_time || null,
        end_time: event.end_time || null,
        type: event.type || null,
      })
      .select()
      .single();

    if (!error && data) {
      setEvents(prev => [...prev, data as Event].sort((a, b) => a.date.localeCompare(b.date)));
    }
    return { data, error };
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setEvents(prev => prev.map(e => e.id === id ? data as Event : e));
    }
    return { data, error };
  };

  const deleteEvent = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
    return { error };
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
