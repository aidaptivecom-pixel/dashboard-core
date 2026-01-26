'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Capture {
  id: string;
  user_id: string;
  type: 'note' | 'voice' | 'image' | 'link' | 'idea';
  content: string;
  transcription: string | null;
  image_url: string | null;
  suggested_space_id: string | null;
  processed: boolean | null;
  created_at: string | null;
}

export function useCaptures() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCaptures = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setCaptures((data as Capture[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCaptures();

    const supabase = createClient();
    const channel = supabase
      .channel('captures_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'captures' }, () => {
        fetchCaptures();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCaptures]);

  const createCapture = async (capture: { type: Capture['type']; content: string; transcription?: string; image_url?: string }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('captures')
      .insert({
        user_id: user.id,
        type: capture.type,
        content: capture.content,
        transcription: capture.transcription || null,
        image_url: capture.image_url || null,
      })
      .select()
      .single();

    if (!error && data) {
      setCaptures(prev => [data as Capture, ...prev]);
    }
    return { data, error };
  };

  const deleteCapture = async (id: string) => {
    const supabase = createClient();
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
    const supabase = createClient();
    const { error } = await supabase
      .from('captures')
      .update({ processed: true, suggested_space_id: spaceId || null })
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
