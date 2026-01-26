'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Space = Database['public']['Tables']['spaces']['Row'];
type SpaceInsert = Database['public']['Tables']['spaces']['Insert'];
type SpaceUpdate = Database['public']['Tables']['spaces']['Update'];

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = useCallback(async () => {
    const supabase = createClient();
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
  }, []);

  useEffect(() => {
    fetchSpaces();

    const supabase = createClient();
    const channel = supabase
      .channel('spaces_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spaces' }, () => {
        fetchSpaces();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSpaces]);

  const createSpace = async (space: Omit<SpaceInsert, 'user_id'>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const insertData: SpaceInsert = {
      ...space,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('spaces')
      .insert(insertData)
      .select()
      .single();

    if (!error && data) {
      setSpaces(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateSpace = async (id: string, updates: SpaceUpdate) => {
    const supabase = createClient();
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
    const supabase = createClient();
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
