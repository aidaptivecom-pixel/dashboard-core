'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Space {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  is_default: boolean | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = useCallback(async () => {
    const supabase = createClient();
    
    // First check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching spaces:', error);
      setError(error.message);
    } else {
      setSpaces((data as Space[]) || []);
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

  const createSpace = async (space: { name: string; icon?: string; color?: string; description?: string }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Cannot create space: user not authenticated');
      return { error: 'Not authenticated' };
    }

    console.log('Creating space for user:', user.id);
    
    const { data, error } = await supabase
      .from('spaces')
      .insert({
        user_id: user.id,
        name: space.name,
        icon: space.icon || null,
        color: space.color || null,
        description: space.description || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating space:', error);
    } else if (data) {
      console.log('Space created:', data);
      setSpaces(prev => [...prev, data as Space]);
    }
    return { data, error };
  };

  const updateSpace = async (id: string, updates: Partial<Space>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('spaces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setSpaces(prev => prev.map(s => s.id === id ? data as Space : s));
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
