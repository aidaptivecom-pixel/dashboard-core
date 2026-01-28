'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Folder {
  id: string;
  user_id: string;
  space_id: string;
  parent_id: string | null;
  name: string;
  icon: string | null;
  color: string | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  system_view: string | null; // 'context' | 'commercial' | 'technical' | 'meetings' | null
}

export type { Folder };

export function useFolders(spaceId: string, parentId?: string | null) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    
    let query = supabase
      .from('folders')
      .select('*')
      .eq('space_id', spaceId)
      .order('sort_order', { ascending: true });

    if (parentId === null) {
      query = query.is('parent_id', null);
    } else if (parentId) {
      query = query.eq('parent_id', parentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching folders:', error);
      setError(error.message);
    } else {
      setFolders((data as Folder[]) || []);
    }
    setLoading(false);
  }, [spaceId, parentId]);

  useEffect(() => {
    if (spaceId) {
      fetchFolders();
    }
  }, [fetchFolders, spaceId]);

  const createFolder = async (folder: { name: string; icon?: string; color?: string; parent_id?: string }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        space_id: spaceId,
        name: folder.name,
        icon: folder.icon || '📁',
        color: folder.color || null,
        parent_id: folder.parent_id || null,
      })
      .select()
      .single();

    if (!error && data) {
      setFolders(prev => [...prev, data as Folder]);
    }
    return { data, error };
  };

  const updateFolder = async (id: string, updates: Partial<Folder>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setFolders(prev => prev.map(f => f.id === id ? data as Folder : f));
    }
    return { data, error };
  };

  const deleteFolder = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (!error) {
      setFolders(prev => prev.filter(f => f.id !== id));
    }
    return { error };
  };

  return {
    folders,
    loading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    refetch: fetchFolders,
  };
}
