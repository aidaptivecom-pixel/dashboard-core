'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface FileRecord {
  id: string;
  user_id: string;
  space_id: string;
  folder_id: string | null;
  name: string;
  type: 'image' | 'document' | 'code' | 'presentation' | 'other';
  mime_type: string | null;
  size_bytes: number | null;
  storage_path: string;
  url: string | null;
  is_starred: boolean | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

function getFileType(mimeType: string): FileRecord['type'] {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  if (mimeType.includes('text/') || mimeType.includes('json') || mimeType.includes('javascript')) return 'code';
  return 'other';
}

export function useFiles(spaceId: string, folderId?: string | null) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    
    let query = supabase
      .from('files')
      .select('*')
      .eq('space_id', spaceId)
      .order('is_starred', { ascending: false })
      .order('updated_at', { ascending: false });

    if (folderId === null) {
      query = query.is('folder_id', null);
    } else if (folderId) {
      query = query.eq('folder_id', folderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching files:', error);
      setError(error.message);
    } else {
      setFiles((data as FileRecord[]) || []);
    }
    setLoading(false);
  }, [spaceId, folderId]);

  useEffect(() => {
    if (spaceId) {
      fetchFiles();
    }
  }, [fetchFiles, spaceId]);

  const uploadFile = async (file: File, folderId?: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    setUploading(true);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storagePath = `${user.id}/${spaceId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(storagePath, file);

      if (uploadError) {
        setUploading(false);
        return { error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-files')
        .getPublicUrl(storagePath);

      // Create file record
      const { data, error } = await supabase
        .from('files')
        .insert({
          user_id: user.id,
          space_id: spaceId,
          folder_id: folderId || null,
          name: file.name,
          type: getFileType(file.type),
          mime_type: file.type,
          size_bytes: file.size,
          storage_path: storagePath,
          url: urlData.publicUrl,
        })
        .select()
        .single();

      if (!error && data) {
        setFiles(prev => [data as FileRecord, ...prev]);
      }

      setUploading(false);
      return { data, error };
    } catch (err) {
      setUploading(false);
      return { error: 'Upload failed' };
    }
  };

  const deleteFile = async (id: string, storagePath: string) => {
    const supabase = createClient();
    
    // Delete from storage
    await supabase.storage
      .from('user-files')
      .remove([storagePath]);

    // Delete record
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id);

    if (!error) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
    return { error };
  };

  const toggleStar = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return { error: 'File not found' };

    const supabase = createClient();
    const { data, error } = await supabase
      .from('files')
      .update({ is_starred: !file.is_starred })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setFiles(prev => prev.map(f => f.id === id ? data as FileRecord : f));
    }
    return { data, error };
  };

  return {
    files,
    loading,
    error,
    uploading,
    uploadFile,
    deleteFile,
    toggleStar,
    refetch: fetchFiles,
  };
}
