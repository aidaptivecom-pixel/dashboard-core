'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Contact {
  id: string;
  user_id: string;
  space_id: string | null;
  phone: string | null;
  name: string;
  email: string | null;
  avatar_url: string | null;
  platform: 'whatsapp' | 'telegram' | 'email' | 'other';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  contact_id: string;
  space_id: string | null;
  status: 'unread' | 'pending' | 'resolved' | 'archived';
  assigned_to: 'agent' | 'human';
  subject: string | null;
  last_message_at: string;
  last_message_preview: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
  contact?: Contact;
  space?: { id: string; name: string; icon: string | null; color: string | null };
}

export interface Message {
  id: string;
  conversation_id: string;
  direction: 'inbound' | 'outbound';
  sent_by: 'client' | 'agent' | 'human';
  content: string;
  content_type: 'text' | 'image' | 'audio' | 'document' | 'location';
  media_url: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export function useConversations(spaceId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    
    let query = supabase
      .from('conversations')
      .select(`
        *,
        contact:contacts(*),
        space:spaces(id, name, icon, color)
      `)
      .order('last_message_at', { ascending: false });

    if (spaceId) {
      query = query.eq('space_id', spaceId);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setConversations((data as Conversation[]) || []);
    }
    setLoading(false);
  }, [spaceId]);

  useEffect(() => {
    fetchConversations();

    const supabase = createClient();
    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchConversations();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [fetchConversations]);

  const updateConversation = async (id: string, updates: Partial<Conversation>) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setConversations(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }
    return { error };
  };

  const markAsRead = async (id: string) => {
    return updateConversation(id, { status: 'pending', unread_count: 0 });
  };

  const markAsResolved = async (id: string) => {
    return updateConversation(id, { status: 'resolved' });
  };

  const takeOver = async (id: string) => {
    return updateConversation(id, { assigned_to: 'human' });
  };

  const assignToAgent = async (id: string) => {
    return updateConversation(id, { assigned_to: 'agent' });
  };

  return {
    conversations,
    loading,
    error,
    updateConversation,
    markAsRead,
    markAsResolved,
    takeOver,
    assignToAgent,
    refetch: fetchConversations,
  };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const supabase = createClient();
    setLoading(true);
    
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    setMessages((data as Message[]) || []);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();

    if (!conversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages_${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (content: string, sentBy: 'human' | 'agent' = 'human') => {
    if (!conversationId) return { error: 'No conversation selected' };

    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        direction: 'outbound',
        sent_by: sentBy,
        content,
      })
      .select()
      .single();

    return { data, error };
  };

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages,
  };
}
