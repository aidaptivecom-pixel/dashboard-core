"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { NoteEditor } from "@/components/editor/NoteEditor";
import { motion, AnimatePresence } from "framer-motion";
import {
    Folder,
    FileText,
    Image,
    File,
    Plus,
    Search,
    Grid,
    List,
    MoreHorizontal,
    Upload,
    FolderPlus,
    Star,
    ArrowUpDown,
    StickyNote,
    FileCode,
    Presentation,
    Bot,
    Sparkles,
    Copy,
    Check,
    X,
    Download,
    RefreshCw,
    Edit3,
    Loader2,
    Target,
    CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";

interface Space {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    description: string | null;
}

interface Note {
    id: string;
    title: string;
    content: string | null;
    icon: string | null;
    is_pinned: boolean | null;
    created_at: string | null;
    updated_at: string | null;
}

const getFileIcon = (type: string) => {
    switch (type) {
        case "folder": return Folder;
        case "note": return StickyNote;
        case "document": return FileText;
        case "image": return Image;
        case "code": return FileCode;
        case "presentation": return Presentation;
        default: return File;
    }
};

const getFileColor = (type: string) => {
    switch (type) {
        case "folder": return "text-yellow-500 bg-yellow-500/10";
        case "note": return "text-green-500 bg-green-500/10";
        case "document": return "text-blue-500 bg-blue-500/10";
        case "image": return "text-pink-500 bg-pink-500/10";
        case "code": return "text-purple bg-purple/10";
        case "presentation": return "text-orange-500 bg-orange-500/10";
        default: return "text-muted-foreground bg-muted";
    }
};

function formatTimeAgo(dateString: string | null): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es");
}

export default function SpacePage() {
    const params = useParams();
    const spaceId = params.id as string;
    
    const [space, setSpace] = useState<Space | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("date");
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [isNewNote, setIsNewNote] = useState(false);

    const { goals } = useGoals(spaceId);
    const { tasks } = useTasks(spaceId);

    useEffect(() => {
        const fetchSpaceData = async () => {
            const supabase = createClient();
            setLoading(true);

            // Fetch space
            const { data: spaceData, error: spaceError } = await supabase
                .from('spaces')
                .select('*')
                .eq('id', spaceId)
                .single();

            if (spaceError || !spaceData) {
                console.error('Error fetching space:', spaceError);
                setLoading(false);
                return;
            }

            setSpace(spaceData as Space);

            // Fetch notes for this space
            const { data: notesData } = await supabase
                .from('notes')
                .select('*')
                .eq('space_id', spaceId)
                .order('is_pinned', { ascending: false })
                .order('updated_at', { ascending: false });

            setNotes((notesData as Note[]) || []);
            setLoading(false);
        };

        fetchSpaceData();
    }, [spaceId]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    if (!space) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Espacio no encontrado</p>
                </div>
            </MainLayout>
        );
    }

    const filteredNotes = notes
        .filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") return a.title.localeCompare(b.title);
            return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
        });

    const generateContextText = () => {
        const today = new Date().toLocaleDateString("es", { 
            weekday: "long", 
            day: "numeric", 
            month: "long",
            year: "numeric"
        });

        return `# Contexto: ${space.name} ${space.icon || "📁"}
Generado: ${today}

## Descripción
${space.description || "Sin descripción"}

## Metas activas (${goals.filter(g => g.status === 'active').length})
${goals.filter(g => g.status === 'active').map(g => `- ${g.title} (${g.progress || 0}%)`).join("\n") || "- Sin metas activas"}

## Tareas pendientes (${tasks.filter(t => !t.completed).length})
${tasks.filter(t => !t.completed).slice(0, 10).map(t => `- [ ] ${t.title}`).join("\n") || "- Sin tareas pendientes"}

## Notas (${notes.length})
${notes.map(n => `- 📝 ${n.title}`).join("\n") || "- Sin notas"}

---
Este contexto fue generado por FocusFlow para usar con Claude.
`;
    };

    const handleCopyContext = async () => {
        const text = generateContextText();
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadContext = () => {
        const text = generateContextText();
        const blob = new Blob([text], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `contexto-${space.id}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateContext = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 1500);
    };

    const handleOpenNote = (note: Note) => {
        setEditingNote(note);
        setIsNewNote(false);
        setIsEditorOpen(true);
    };

    const handleNewNote = () => {
        setEditingNote(null);
        setIsNewNote(true);
        setIsEditorOpen(true);
    };

    const handleSaveNote = async (note: { title: string; content: string }) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (isNewNote) {
            const { data, error } = await supabase
                .from('notes')
                .insert({
                    user_id: user.id,
                    space_id: spaceId,
                    title: note.title,
                    content: note.content,
                })
                .select()
                .single();

            if (!error && data) {
                setNotes(prev => [data as Note, ...prev]);
            }
        } else if (editingNote) {
            const { data, error } = await supabase
                .from('notes')
                .update({
                    title: note.title,
                    content: note.content,
                })
                .eq('id', editingNote.id)
                .select()
                .single();

            if (!error && data) {
                setNotes(prev => prev.map(n => n.id === editingNote.id ? data as Note : n));
            }
        }
        
        setIsEditorOpen(false);
        setEditingNote(null);
    };

    const handleTogglePinned = async (noteId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const note = notes.find(n => n.id === noteId);
        if (!note) return;

        const supabase = createClient();
        const { error } = await supabase
            .from('notes')
            .update({ is_pinned: !note.is_pinned })
            .eq('id', noteId);

        if (!error) {
            setNotes(prev => prev.map(n => 
                n.id === noteId ? { ...n, is_pinned: !n.is_pinned } : n
            ));
        }
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div 
                            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                            style={{ backgroundColor: `${space.color || '#4F6BFF'}15` }}
                        >
                            {space.icon || "📁"}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{space.name}</h1>
                            <p className="text-muted-foreground">{space.description || "Sin descripción"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleNewNote}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo
                        </button>
                        <button 
                            onClick={() => setIsContextModalOpen(true)}
                            className="p-2.5 rounded-xl border border-border hover:bg-accent hover:border-primary/30 transition-all group"
                            title="Generar contexto para Claude"
                        >
                            <Bot className="h-5 w-5 group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-4 rounded-xl border border-border bg-background">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Target className="h-4 w-4" />
                            <span className="text-sm">Metas</span>
                        </div>
                        <p className="text-2xl font-bold">{goals.filter(g => g.status === 'active').length}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <CheckSquare className="h-4 w-4" />
                            <span className="text-sm">Tareas</span>
                        </div>
                        <p className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <StickyNote className="h-4 w-4" />
                            <span className="text-sm">Notas</span>
                        </div>
                        <p className="text-2xl font-bold">{notes.length}</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar en este espacio..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setSortBy(sortBy === "name" ? "date" : "name")}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-accent transition-colors text-sm"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            {sortBy === "name" ? "Nombre" : "Fecha"}
                        </button>
                        <div className="flex border border-border rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-accent" : "hover:bg-accent")}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn("p-2 transition-colors", viewMode === "list" ? "bg-accent" : "hover:bg-accent")}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button 
                        onClick={handleNewNote}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:bg-accent hover:border-green-500/30 transition-colors text-sm whitespace-nowrap"
                    >
                        <StickyNote className="h-4 w-4" />
                        Nueva nota
                    </button>
                </div>

                {/* Content */}
                {viewMode === "grid" ? (
                    <div className="space-y-6">
                        {filteredNotes.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Notas</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {filteredNotes.map((note) => {
                                        const colorClass = getFileColor("note");
                                        
                                        return (
                                            <motion.button
                                                key={note.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleOpenNote(note)}
                                                className="group p-4 rounded-2xl border border-border bg-background hover:bg-accent hover:border-primary/20 transition-all text-left relative"
                                            >
                                                <button
                                                    onClick={(e) => handleTogglePinned(note.id, e)}
                                                    className={cn(
                                                        "absolute top-2 right-2 p-1 rounded-lg transition-all",
                                                        note.is_pinned 
                                                            ? "text-yellow-500" 
                                                            : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-yellow-500"
                                                    )}
                                                >
                                                    <Star className={cn("h-4 w-4", note.is_pinned && "fill-yellow-500")} />
                                                </button>
                                                <div className={cn("p-3 rounded-xl w-fit mb-3", colorClass)}>
                                                    <StickyNote className="h-6 w-6" />
                                                </div>
                                                <p className="font-medium truncate">{note.title}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-xs text-muted-foreground">{formatTimeAgo(note.updated_at)}</p>
                                                    <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="border border-border rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-[1fr,auto,auto] gap-4 px-4 py-2 bg-muted/50 text-sm font-medium text-muted-foreground">
                            <span>Nombre</span>
                            <span className="w-24">Modificado</span>
                            <span className="w-8"></span>
                        </div>
                        {filteredNotes.map((note, index) => (
                            <motion.button
                                key={note.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.02 }}
                                onClick={() => handleOpenNote(note)}
                                className="w-full grid grid-cols-[1fr,auto,auto] gap-4 px-4 py-3 hover:bg-accent transition-colors text-left items-center border-t border-border"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={cn("p-2 rounded-lg", getFileColor("note"))}>
                                        <StickyNote className="h-4 w-4" />
                                    </div>
                                    <span className="truncate">{note.title}</span>
                                    {note.is_pinned && (
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                    )}
                                    <Edit3 className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground w-24">{formatTimeAgo(note.updated_at)}</span>
                                <button 
                                    className="p-1 rounded hover:bg-muted w-8"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </motion.button>
                        ))}
                    </div>
                )}

                {filteredNotes.length === 0 && (
                    <div className="text-center py-12">
                        <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">
                            {searchQuery ? "No se encontraron resultados" : "Este espacio está vacío"}
                        </p>
                        <button onClick={handleNewNote} className="mt-4 text-primary hover:underline">
                            Crear una nota
                        </button>
                    </div>
                )}
            </div>

            {/* Note Editor */}
            <NoteEditor
                isOpen={isEditorOpen}
                onClose={() => {
                    setIsEditorOpen(false);
                    setEditingNote(null);
                }}
                onSave={handleSaveNote}
                initialTitle={editingNote?.title || ""}
                initialContent={editingNote?.content || ""}
                spaceColor={space.color || "#4F6BFF"}
            />

            {/* Context Modal */}
            <AnimatePresence>
                {isContextModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsContextModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[80vh] z-50 flex flex-col mx-4"
                        >
                            <div className="rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col max-h-full">
                                <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl" style={{ backgroundColor: `${space.color}15` }}>
                                            <Sparkles className="h-5 w-5" style={{ color: space.color || "#4F6BFF" }} />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold">Contexto para Claude</h2>
                                            <p className="text-sm text-muted-foreground">{space.name}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsContextModalOpen(false)} className="p-2 rounded-lg hover:bg-accent">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                        <p className="text-sm">
                                            Este contexto contiene información sobre <strong>{space.name}</strong> que podés copiar y pegar en Claude para que entienda tu proyecto.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                                            <span className="text-xs font-medium text-muted-foreground">contexto-{space.id}.md</span>
                                            <button
                                                onClick={handleGenerateContext}
                                                disabled={isGenerating}
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <RefreshCw className={cn("h-3 w-3", isGenerating && "animate-spin")} />
                                                Regenerar
                                            </button>
                                        </div>
                                        <pre className="p-4 text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                                            {generateContextText()}
                                        </pre>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30 flex-shrink-0">
                                    <button
                                        onClick={handleDownloadContext}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors text-sm"
                                    >
                                        <Download className="h-4 w-4" />
                                        Descargar .md
                                    </button>
                                    <button onClick={handleCopyContext} className="btn-primary flex items-center gap-2">
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                ¡Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copiar contexto
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
