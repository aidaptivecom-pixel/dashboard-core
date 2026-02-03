"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import {
    Brain,
    Search,
    Filter,
    Sparkles,
    Clock,
    Tag,
    TrendingUp,
    TrendingDown,
    Loader2,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Memory {
    id: string;
    content: string;
    type: string;
    project: string | null;
    relevance: number;
    importance: number;
    access_count: number;
    created_at: string;
    last_accessed: string | null;
    metadata: {
        tags?: string[];
    };
}

type TypeFilter = 'all' | 'decision' | 'fact' | 'summary' | 'tool_call' | 'insight' | 'emotion';

const typeConfig: Record<string, { label: string; color: string; emoji: string }> = {
    decision: { label: 'Decisión', color: 'bg-purple-500', emoji: '🎯' },
    fact: { label: 'Hecho', color: 'bg-blue-500', emoji: '📝' },
    summary: { label: 'Resumen', color: 'bg-green-500', emoji: '📋' },
    tool_call: { label: 'Tool Call', color: 'bg-gray-500', emoji: '🔧' },
    insight: { label: 'Insight', color: 'bg-amber-500', emoji: '💡' },
    emotion: { label: 'Emoción', color: 'bg-pink-500', emoji: '💭' },
};

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function RelevanceBar({ relevance, importance }: { relevance: number; importance: number }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-muted-foreground">Imp:</span>
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${importance * 100}%` }} 
                    />
                </div>
                <span className="font-mono">{(importance * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="text-muted-foreground">Rel:</span>
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${relevance * 100}%` }} 
                    />
                </div>
                <span className="font-mono">{(relevance * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
}

export default function MemoryPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [projectFilter, setProjectFilter] = useState<string | null>(null);
    const [projects, setProjects] = useState<string[]>([]);
    const [stats, setStats] = useState<{
        total: number;
        byType: Record<string, number>;
        avgRelevance: number;
    } | null>(null);

    // Fetch memories
    useEffect(() => {
        async function fetchMemories() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('pulso_memories')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setMemories(data || []);

                // Extract unique projects
                const projectList = data?.map(m => m.project).filter((p): p is string => p !== null && p !== undefined) || [];
                const uniqueProjects = [...new Set(projectList)];
                setProjects(uniqueProjects);

                // Calculate stats
                if (data && data.length > 0) {
                    const byType: Record<string, number> = {};
                    data.forEach(m => {
                        byType[m.type] = (byType[m.type] || 0) + 1;
                    });
                    const avgRelevance = data.reduce((sum, m) => sum + m.relevance, 0) / data.length;
                    setStats({ total: data.length, byType, avgRelevance });
                }
            } catch (error) {
                console.error('Error fetching memories:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchMemories();
    }, []);

    // Filter memories
    const filteredMemories = memories.filter(m => {
        if (typeFilter !== 'all' && m.type !== typeFilter) return false;
        if (projectFilter && m.project !== projectFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesContent = m.content.toLowerCase().includes(query);
            const matchesTags = m.metadata?.tags?.some(t => t.toLowerCase().includes(query));
            if (!matchesContent && !matchesTags) return false;
        }
        return true;
    });

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Brain className="h-7 w-7" />
                            Pulso Memory
                            <span className="px-2 py-0.5 text-sm rounded-full bg-primary/10 text-primary">
                                {stats?.total || 0} memorias
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Sistema de memoria persistente con búsqueda semántica
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-background">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-sm text-muted-foreground">Total Memorias</div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-background">
                            <div className="text-2xl font-bold">{(stats.avgRelevance * 100).toFixed(0)}%</div>
                            <div className="text-sm text-muted-foreground">Relevancia Promedio</div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-background">
                            <div className="text-2xl font-bold">{stats.byType['decision'] || 0}</div>
                            <div className="text-sm text-muted-foreground">Decisiones</div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-background">
                            <div className="text-2xl font-bold">{projects.length}</div>
                            <div className="text-sm text-muted-foreground">Proyectos</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar en memorias..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                    </div>

                    {/* Type filter */}
                    <div className="flex gap-1 overflow-x-auto">
                        {(['all', 'decision', 'fact', 'summary', 'insight', 'tool_call'] as TypeFilter[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setTypeFilter(type)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                                    typeFilter === type
                                        ? "bg-primary text-white"
                                        : "bg-muted hover:bg-accent"
                                )}
                            >
                                {type === 'all' ? '🔮 Todos' : `${typeConfig[type]?.emoji} ${typeConfig[type]?.label}`}
                            </button>
                        ))}
                    </div>

                    {/* Project filter */}
                    {projects.length > 0 && (
                        <select
                            value={projectFilter || ''}
                            onChange={(e) => setProjectFilter(e.target.value || null)}
                            className="px-3 py-2 rounded-lg text-sm border border-border bg-background"
                        >
                            <option value="">Todos los proyectos</option>
                            {projects.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Memories List */}
                <div className="space-y-3">
                    {filteredMemories.length > 0 ? (
                        filteredMemories.map((memory, index) => (
                            <motion.div
                                key={memory.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-xl border border-border bg-background hover:bg-accent/30 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        {/* Type badge & date */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium text-white",
                                                typeConfig[memory.type]?.color || 'bg-gray-500'
                                            )}>
                                                {typeConfig[memory.type]?.emoji} {typeConfig[memory.type]?.label || memory.type}
                                            </span>
                                            {memory.project && (
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-muted">
                                                    📁 {memory.project}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(memory.created_at)}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <p className="text-sm">{memory.content}</p>

                                        {/* Tags */}
                                        {memory.metadata?.tags && memory.metadata.tags.length > 0 && (
                                            <div className="flex gap-1 flex-wrap">
                                                {memory.metadata.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Relevance bars */}
                                        <RelevanceBar relevance={memory.relevance} importance={memory.importance} />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Brain className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No hay memorias</p>
                            <p className="text-sm text-muted-foreground/70">
                                Las memorias aparecerán aquí cuando Pulso las guarde
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
