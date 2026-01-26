'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Space = Database['public']['Tables']['spaces']['Row'];
type SpaceInsert = Database['public']['Tables']['spaces']['Insert'];
type SpaceUpdate = Database['public']['Tables']['spaces']['Update'];

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSpaces = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setSpaces(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpaces();

    // Realtime subscription
    const channel = supabase
      .channel('spaces_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spaces' }, () => {
        fetchSpaces();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createSpace = async (space: Omit<SpaceInsert, 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('spaces')
      .insert({ ...space, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setSpaces(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateSpace = async (id: string, updates: SpaceUpdate) => {
    const { data, error } = await supabase
      .from('spaces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setSpaces(prev => prev.map(s => s.id === id ? data : s));
    }
    return { data, error };
  };

  const deleteSpace = async (id: string) => {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .eq('id', id);

    if (!error) {
      setSpaces(prev => prev.filter(s => s.id !== id));
    }
    return { error };
  };

  return {
    spaces,
    loading,
    error,
    createSpace,
    updateSpace,
    deleteSpace,
    refetch: fetchSpaces,
  };
}
