"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Inbox,
    Search,
    Filter,
    MessageCircle,
    Phone,
    Mail,
    Bot,
    User,
    Send,
    Paperclip,
    MoreVertical,
    Check,
    CheckCheck,
    Clock,
    Archive,
    UserCheck,
    Sparkles,
    ChevronDown,
    Loader2,
    X,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConversations, useMessages, Conversation } from "@/hooks/useInbox";
import { useSpaces } from "@/hooks/useSpaces";

type StatusFilter = 'all' | 'unread' | 'pending' | 'resolved';

const statusConfig = {
    unread: { label: 'Sin leer', color: 'bg-red-500', icon: MessageCircle },
    pending: { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock },
    resolved: { label: 'Resuelto', color: 'bg-green-500', icon: Check },
    archived: { label: 'Archivado', color: 'bg-gray-500', icon: Archive },
};

const platformIcons = {
    whatsapp: '💬',
    telegram: '✈️',
    email: '📧',
    other: '💭',
};

function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    if (diffDays < 7) return date.toLocaleDateString('es', { weekday: 'short' });
    return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export default function InboxPage() {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [spaceFilter, setSpaceFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const { conversations, loading, markAsRead, markAsResolved, takeOver, assignToAgent } = useConversations();
    const { messages, loading: messagesLoading, sendMessage, approveDraft, editDraft, deleteDraft, regenerateDraft } = useMessages(selectedConversation?.id || null);
    const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
    const [editingDraftContent, setEditingDraftContent] = useState('');
    const { spaces } = useSpaces();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark as read when selecting conversation
    useEffect(() => {
        if (selectedConversation?.status === 'unread') {
            markAsRead(selectedConversation.id);
        }
    }, [selectedConversation]);

    const filteredConversations = conversations.filter(conv => {
        if (statusFilter !== 'all' && conv.status !== statusFilter) return false;
        if (spaceFilter && conv.space_id !== spaceFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesName = conv.contact?.name.toLowerCase().includes(query);
            const matchesPreview = conv.last_message_preview?.toLowerCase().includes(query);
            if (!matchesName && !matchesPreview) return false;
        }
        return true;
    });

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation) return;
        await sendMessage(messageInput, 'human');
        setMessageInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const unreadCount = conversations.filter(c => c.status === 'unread').length;
    const pendingCount = conversations.filter(c => c.status === 'pending').length;

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="h-[calc(100vh-120px)] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Inbox className="h-7 w-7" />
                            Inbox
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 text-sm rounded-full bg-red-500 text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </h1>
                        <p className="text-muted-foreground text-sm">Conversaciones con clientes</p>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex gap-4 min-h-0">
                    {/* Conversations list */}
                    <div className={cn("w-full md:w-96 flex flex-col border border-border rounded-2xl bg-background overflow-hidden", mobileView === 'chat' && "hidden md:flex")}>
                        {/* Search & Filters */}
                        <div className="p-3 border-b border-border space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar conversación..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                />
                            </div>
                            
                            {/* Status filters */}
                            <div className="flex gap-1 overflow-x-auto pb-1">
                                {(['all', 'unread', 'pending', 'resolved'] as StatusFilter[]).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                                            statusFilter === status
                                                ? "bg-primary text-white"
                                                : "bg-muted hover:bg-accent"
                                        )}
                                    >
                                        {status === 'all' ? 'Todos' : statusConfig[status].label}
                                        {status === 'unread' && unreadCount > 0 && (
                                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20">{unreadCount}</span>
                                        )}
                                        {status === 'pending' && pendingCount > 0 && (
                                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20">{pendingCount}</span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Space filter */}
                            <div className="flex gap-1 overflow-x-auto">
                                <button
                                    onClick={() => setSpaceFilter(null)}
                                    className={cn(
                                        "px-2 py-1 rounded-lg text-xs transition-colors",
                                        !spaceFilter ? "bg-accent" : "hover:bg-accent"
                                    )}
                                >
                                    Todos
                                </button>
                                {spaces.map((space) => (
                                    <button
                                        key={space.id}
                                        onClick={() => setSpaceFilter(spaceFilter === space.id ? null : space.id)}
                                        className={cn(
                                            "px-2 py-1 rounded-lg text-xs transition-colors",
                                            spaceFilter === space.id ? "bg-accent" : "hover:bg-accent"
                                        )}
                                        title={space.name}
                                    >
                                        {space.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length > 0 ? (
                                filteredConversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => { setSelectedConversation(conv); setMobileView('chat'); }}
                                        className={cn(
                                            "w-full p-3 flex gap-3 border-b border-border hover:bg-accent/50 transition-colors text-left",
                                            selectedConversation?.id === conv.id && "bg-accent"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-lg font-medium">
                                                {conv.contact?.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 text-sm">
                                                {platformIcons[conv.contact?.platform || 'other']}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-medium truncate">{conv.contact?.name}</span>
                                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                                    {formatTime(conv.last_message_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {conv.space && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted truncate">
                                                        {conv.space.icon} {conv.space.name}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate mt-1">
                                                {conv.last_message_preview || 'Sin mensajes'}
                                            </p>
                                        </div>

                                        {/* Status indicator */}
                                        <div className="flex flex-col items-end gap-1">
                                            {conv.status === 'unread' && conv.unread_count > 0 && (
                                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                            {conv.assigned_to === 'agent' && (
                                                <Bot className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                    <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground">No hay conversaciones</p>
                                    <p className="text-sm text-muted-foreground/70">Las conversaciones aparecerán aquí</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat view */}
                    <div className={cn("flex-1 flex-col border border-border rounded-2xl bg-background overflow-hidden", mobileView === 'chat' ? "flex" : "hidden md:flex")}>
                        {selectedConversation ? (
                            <>
                                {/* Chat header */}
                                <div className="p-4 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <button onClick={() => setMobileView('list')} className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-accent transition-colors flex-shrink-0">
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-medium flex-shrink-0">
                                            {selectedConversation.contact?.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-medium truncate">{selectedConversation.contact?.name}</h3>
                                            <p className="text-xs text-muted-foreground items-center gap-2 hidden sm:flex">
                                                {selectedConversation.contact?.phone || selectedConversation.contact?.email}
                                                {selectedConversation.space && (
                                                    <span className="px-1.5 py-0.5 rounded bg-muted">
                                                        {selectedConversation.space.icon} {selectedConversation.space.name}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                        {selectedConversation.assigned_to === 'agent' ? (
                                            <button
                                                onClick={() => takeOver(selectedConversation.id)}
                                                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg text-sm border border-border hover:bg-accent transition-colors"
                                                title="Tomar control"
                                            >
                                                <UserCheck className="h-4 w-4" />
                                                <span className="hidden sm:inline">Tomar control</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => assignToAgent(selectedConversation.id)}
                                                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg text-sm border border-border hover:bg-accent transition-colors"
                                                title="Asignar a IA"
                                            >
                                                <Bot className="h-4 w-4" />
                                                <span className="hidden sm:inline">Asignar a IA</span>
                                            </button>
                                        )}
                                        {selectedConversation.status !== 'resolved' && (
                                            <button
                                                onClick={() => markAsResolved(selectedConversation.id)}
                                                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg text-sm bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                                                title="Resolver"
                                            >
                                                <Check className="h-4 w-4" />
                                                <span className="hidden sm:inline">Resolver</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messagesLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                    ) : messages.length > 0 ? (
                                        messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={cn(
                                                    "flex",
                                                    msg.sent_by === 'draft' ? 'justify-end' : msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
                                                )}
                                            >
                                                {msg.sent_by === 'draft' ? (
                                                    <div className="max-w-[70%] space-y-1">
                                                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">🤖 Borrador del Closer</span>
                                                        <div className="rounded-2xl px-4 py-2 bg-amber-100 dark:bg-amber-900/30 border border-dashed border-amber-300 dark:border-amber-700 rounded-br-md">
                                                            {editingDraftId === msg.id ? (
                                                                <div className="space-y-2">
                                                                    <textarea
                                                                        value={editingDraftContent}
                                                                        onChange={(e) => setEditingDraftContent(e.target.value)}
                                                                        rows={4}
                                                                        className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-amber-950/50 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none text-sm"
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={async () => {
                                                                                await editDraft(msg.id, editingDraftContent);
                                                                                setEditingDraftId(null);
                                                                            }}
                                                                            className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                                        >
                                                                            Guardar
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingDraftId(null)}
                                                                            className="px-3 py-1 rounded-lg text-xs font-medium bg-muted hover:bg-accent transition-colors"
                                                                        >
                                                                            Cancelar
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                            )}
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-amber-600/70 dark:text-amber-400/70 justify-end">
                                                                <Bot className="h-3 w-3" />
                                                                <span>{new Date(msg.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </div>
                                                        {editingDraftId !== msg.id && (
                                                            <div className="flex gap-2 justify-end">
                                                                <button
                                                                    onClick={() => approveDraft(msg.id)}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-1"
                                                                >
                                                                    ✅ Enviar
                                                                </button>
                                                                <button
                                                                    onClick={() => { setEditingDraftId(msg.id); setEditingDraftContent(msg.content); }}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1"
                                                                >
                                                                    ✏️ Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => regenerateDraft(msg.id)}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-1"
                                                                >
                                                                    🔄 Rehacer
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                <div
                                                    className={cn(
                                                        "max-w-[70%] rounded-2xl px-4 py-2",
                                                        msg.direction === 'outbound'
                                                            ? 'bg-primary text-white rounded-br-md'
                                                            : 'bg-muted rounded-bl-md'
                                                    )}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                    <div className={cn(
                                                        "flex items-center gap-1 mt-1 text-xs",
                                                        msg.direction === 'outbound' ? 'text-white/70 justify-end' : 'text-muted-foreground'
                                                    )}>
                                                        {msg.sent_by === 'agent' && <Bot className="h-3 w-3" />}
                                                        {msg.sent_by === 'human' && msg.direction === 'outbound' && <User className="h-3 w-3" />}
                                                        <span>{new Date(msg.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {msg.direction === 'outbound' && <CheckCheck className="h-3 w-3" />}
                                                    </div>
                                                </div>
                                                )}
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                            <p className="text-muted-foreground">No hay mensajes</p>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-border">
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Escribir mensaje..."
                                                rows={1}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className="p-3 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                <div className="p-6 rounded-full bg-muted mb-4">
                                    <Inbox className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
                                <p className="text-muted-foreground">Elige una conversación de la lista para ver los mensajes</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
