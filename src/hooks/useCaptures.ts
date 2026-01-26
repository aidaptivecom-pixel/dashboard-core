'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Capture = Database['public']['Tables']['captures']['Row'];
type CaptureInsert = Database['public']['Tables']['captures']['Insert'];

export function useCaptures() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchCaptures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setCaptures(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCaptures();

    const channel = supabase
      .channel('captures_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'captures' }, () => {
        fetchCaptures();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createCapture = async (capture: Omit<CaptureInsert, 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('captures')
      .insert({ ...capture, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setCaptures(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const deleteCapture = async (id: string) => {
    const { error } = await supabase
      .from('captures')
      .delete()
      .eq('id', id);

    if (!error) {
      setCaptures(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  const markAsProcessed = async (id: string, spaceId?: string) => {
    const { error } = await supabase
      .from('captures')
      .update({ processed: true, suggested_space_id: spaceId })
      .eq('id', id);

    if (!error) {
      setCaptures(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  const unprocessedCount = captures.filter(c => !c.processed).length;

  return {
    captures: captures.filter(c => !c.processed),
    allCaptures: captures,
    loading,
    error,
    unprocessedCount,
    createCapture,
    deleteCapture,
    markAsProcessed,
    refetch: fetchCaptures,
  };
}
