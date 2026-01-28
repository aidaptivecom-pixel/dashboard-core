import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ProjectCredential {
  id: string;
  space_id: string;
  category: string;
  name: string;
  credential_type: string;
  value: string;
  notes: string | null;
  visible_to: string[];
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
}

export function useProjectCredentials(spaceId: string) {
  const [credentials, setCredentials] = useState<ProjectCredential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredentials = async () => {
      const supabase = createClient();
      setLoading(true);

      const { data } = await supabase
        .from('project_credentials')
        .select('*')
        .eq('space_id', spaceId)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      setCredentials((data as ProjectCredential[]) || []);
      setLoading(false);
    };

    if (spaceId) {
      fetchCredentials();
    }
  }, [spaceId]);

  const addCredential = async (credential: Omit<ProjectCredential, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('project_credentials')
      .insert({ ...credential, space_id: spaceId, created_by: 'dashboard' })
      .select()
      .single();

    if (!error && data) {
      setCredentials(prev => [...prev, data as ProjectCredential]);
    }
    return { data, error };
  };

  const updateCredential = async (id: string, updates: Partial<ProjectCredential>) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('project_credentials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setCredentials(prev => prev.map(c => c.id === id ? data as ProjectCredential : c));
    }
    return { data, error };
  };

  const deleteCredential = async (id: string) => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('project_credentials')
      .delete()
      .eq('id', id);

    if (!error) {
      setCredentials(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  // Group by category
  const groupedCredentials = credentials.reduce((acc, cred) => {
    const category = cred.category || 'otros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(cred);
    return acc;
  }, {} as Record<string, ProjectCredential[]>);

  return {
    credentials,
    groupedCredentials,
    loading,
    addCredential,
    updateCredential,
    deleteCredential,
  };
}
