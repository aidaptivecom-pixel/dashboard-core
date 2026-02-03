"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
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
    Trash2,
    ChevronRight,
    Home,
    Circle,
    CheckCircle2,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";
import { useFolders, Folder as FolderData } from "@/hooks/useFolders";
import { useFiles } from "@/hooks/useFiles";
import { SystemFolderView } from "@/components/project/SystemFolderView";
import { FolderTree } from "@/components/project/FolderTree";

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
    folder_id: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface FolderType {
    id: string;
    name: string;
    icon: string | null;
    parent_id: string | null;
    system_view: string | null;
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

function formatFileSize(bytes: number | null): string {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type TabType = "files" | "tasks" | "goals";

export default function SpacePage() {
    const params = useParams();
    const spaceId = params.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [space, setSpace] = useState<Space | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [currentFolderSystemView, setCurrentFolderSystemView] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<FolderType[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("date");
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [isNewNote, setIsNewNote] = useState(false);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("files");
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
    const { goals } = useGoals(spaceId);
    const { tasks, createTask, updateTask } = useTasks(spaceId);
    const { folders: currentFolders, createFolder } = useFolders(spaceId, currentFolderId);
    const { folders: allFolders, loading: foldersLoading } = useFolders(spaceId, null, { all: true }); // Get all folders for tree
    const { files, uploading, uploadFile, toggleStar } = useFiles(spaceId, currentFolderId);

    useEffect(() => {
        const fetchSpaceData = async () => {
            const supabase = createClient();
            setLoading(true);

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
            setLoading(false);
        };

        fetchSpaceData();
    }, [spaceId]);

    useEffect(() => {
        const fetchNotes = async () => {
            const supabase = createClient();
            let query = supabase
                .from('notes')
                .select('*')
                .eq('space_id', spaceId)
                .order('is_pinned', { ascending: false })
                .order('updated_at', { ascending: false });

            if (currentFolderId === null) {
                query = query.is('folder_id', null);
            } else {
                query = query.eq('folder_id', currentFolderId);
            }

            const { data } = await query;
            setNotes((data as Note[]) || []);
        };

        fetchNotes();
    }, [spaceId, currentFolderId]);

    const navigateToFolder = async (folderId: string | null, folder?: FolderType) => {
        if (folderId === null) {
            setCurrentFolderId(null);
            setCurrentFolderSystemView(null);
            setFolderPath([]);
        } else if (folder) {
            setCurrentFolderId(folderId);
            setCurrentFolderSystemView(folder.system_view || null);
            const existingIndex = folderPath.findIndex(f => f.id === folderId);
            if (existingIndex >= 0) {
                setFolderPath(folderPath.slice(0, existingIndex + 1));
            } else {
                setFolderPath([...folderPath, folder]);
            }
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        await createFolder({ 
            name: newFolderName, 
            parent_id: currentFolderId || undefined 
        });
        setNewFolderName("");
        setShowNewFolderModal(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadFile(file, currentFolderId || undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCreateTask = async () => {
        if (!newTaskTitle.trim()) return;
        await createTask({
            title: newTaskTitle,
            priority: newTaskPriority,
        });
        setNewTaskTitle("");
        setNewTaskPriority("medium");
        setShowNewTaskModal(false);
    };

    const handleToggleTask = async (taskId: string, completed: boolean) => {
        await updateTask(taskId, { completed: !completed });
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </>
        );
    }

    if (!space) {
        return (
            <>
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Espacio no encontrado</p>
                </div>
            </>
        );
    }

    const filteredFolders = currentFolders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredGoals = goals.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const pendingTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);

    const generateContextText = () => {
        const today = new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        return `# Contexto: ${space.name} ${space.icon || "📁"}\nGenerado: ${today}\n\n## Descripción\n${space.description || "Sin descripción"}\n\n## Metas activas (${goals.filter(g => g.status === 'active').length})\n${goals.filter(g => g.status === 'active').map(g => `- ${g.title} (${g.progress || 0}%)`).join("\n") || "- Sin metas activas"}\n\n## Tareas pendientes (${tasks.filter(t => !t.completed).length})\n${tasks.filter(t => !t.completed).slice(0, 10).map(t => `- [ ] ${t.title}`).join("\n") || "- Sin tareas pendientes"}\n\n## Notas (${notes.length})\n${notes.map(n => `- 📝 ${n.title}`).join("\n") || "- Sin notas"}\n\n---\nEste contexto fue generado por FocusFlow.`;
    };

    const handleCopyContext = async () => {
        await navigator.clipboard.writeText(generateContextText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadContext = () => {
        const blob = new Blob([generateContextText()], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `contexto-${space.id}.md`;
        a.click();
        URL.revokeObjectURL(url);
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
                .insert({ user_id: user.id, space_id: spaceId, folder_id: currentFolderId, title: note.title, content: note.content })
                .select()
                .single();
            if (!error && data) setNotes(prev => [data as Note, ...prev]);
        } else if (editingNote) {
            const { data, error } = await supabase
                .from('notes')
                .update({ title: note.title, content: note.content })
                .eq('id', editingNote.id)
                .select()
                .single();
            if (!error && data) setNotes(prev => prev.map(n => n.id === editingNote.id ? data as Note : n));
        }
        setIsEditorOpen(false);
        setEditingNote(null);
    };

    const handleTogglePinned = async (noteId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        const supabase = createClient();
        const { error } = await supabase.from('notes').update({ is_pinned: !note.is_pinned }).eq('id', noteId);
        if (!error) setNotes(prev => prev.map(n => n.id === noteId ? { ...n, is_pinned: !n.is_pinned } : n));
    };

    return (
        <>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: `${space.color || '#4F6BFF'}15` }}>
                            {space.icon || "📁"}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{space.name}</h1>
                            <p className="text-muted-foreground">{space.description || "Sin descripción"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsContextModalOpen(true)} className="p-2.5 rounded-xl border border-border hover:bg-accent hover:border-primary/30 transition-all group" title="Generar contexto para Claude">
                            <Bot className="h-5 w-5 group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Unified Workspace Container */}
                <div className="rounded-2xl border border-border bg-background overflow-hidden">
                    {/* Stats Row - Clickable filters */}
                    <div className="flex items-center divide-x divide-border border-b border-border">
                        <button 
                            onClick={() => setActiveTab("goals")} 
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all hover:bg-accent",
                                activeTab === "goals" && "bg-primary/10 text-primary"
                            )}
                        >
                            <Target className="h-4 w-4" />
                            <span className="font-medium">{goals.filter(g => g.status === 'active').length}</span>
                            <span className="text-sm text-muted-foreground hidden sm:inline">Metas</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab("tasks")} 
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all hover:bg-accent",
                                activeTab === "tasks" && "bg-primary/10 text-primary"
                            )}
                        >
                            <CheckSquare className="h-4 w-4" />
                            <span className="font-medium">{tasks.filter(t => !t.completed).length}</span>
                            <span className="text-sm text-muted-foreground hidden sm:inline">Tareas</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab("files")} 
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all hover:bg-accent",
                                activeTab === "files" && "bg-primary/10 text-primary"
                            )}
                        >
                            <StickyNote className="h-4 w-4" />
                            <span className="font-medium">{notes.length}</span>
                            <span className="text-sm text-muted-foreground hidden sm:inline">Notas</span>
                        </button>
                    </div>
                    
                    {/* Actions Row */}
                    <div className="flex items-center justify-between px-3 py-2 gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setShowNewFolderModal(true)} 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                            >
                                <FolderPlus className="h-4 w-4" />
                                <span className="hidden sm:inline">Carpeta</span>
                            </button>
                            <button 
                                onClick={handleNewNote} 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                            >
                                <StickyNote className="h-4 w-4" />
                                <span className="hidden sm:inline">Nota</span>
                            </button>
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
                                <Upload className="h-4 w-4" />
                                <span className="hidden sm:inline">{uploading ? "..." : "Archivo"}</span>
                                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                        </div>
                        
                        {/* Breadcrumb / Home button */}
                        <button 
                            onClick={() => navigateToFolder(null)} 
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                                currentFolderId ? "text-muted-foreground hover:text-foreground hover:bg-accent" : "text-primary bg-primary/10"
                            )}
                        >
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">{space.name}</span>
                        </button>
                    </div>

                    {/* FILES TAB - Finder Layout */}
                    {activeTab === "files" && (
                        <div className="flex min-h-[400px] border-t border-border">
                            {/* Left Panel - Folder Tree */}
                            <div className="w-56 flex-shrink-0 border-r border-border hidden md:flex md:flex-col">
                                <div className="p-3 border-b border-border bg-muted/30">
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Folder className="h-4 w-4" />
                                        Carpetas
                                    </h3>
                                </div>
                            <FolderTree
                                folders={allFolders}
                                currentFolderId={currentFolderId}
                                onFolderSelect={(folderId, folder) => {
                                    if (folderId === null) {
                                        navigateToFolder(null);
                                    } else if (folder) {
                                        navigateToFolder(folderId, {
                                            id: folder.id,
                                            name: folder.name,
                                            icon: folder.icon,
                                            parent_id: folder.parent_id,
                                            system_view: folder.system_view || null
                                        });
                                    }
                                }}
                                onNewFolder={() => setShowNewFolderModal(true)}
                                spaceName={space.name}
                                loading={foldersLoading}
                            />
                        </div>

                        {/* Right Panel - Content */}
                        <div className="flex-1 flex flex-col">
                            {/* Content Header */}
                            <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                    {currentFolderId ? (
                                        <>
                                            <button onClick={() => navigateToFolder(null)} className="text-muted-foreground hover:text-foreground">
                                                <Home className="h-4 w-4" />
                                            </button>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{folderPath[folderPath.length - 1]?.name || "Carpeta"}</span>
                                        </>
                                    ) : (
                                        <span className="font-medium flex items-center gap-2">
                                            <Home className="h-4 w-4" />
                                            Todos los archivos
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1" />
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar..." 
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                        className="w-40 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/20" 
                                    />
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {/* System Folder View */}
                                {currentFolderSystemView && (
                                    <SystemFolderView 
                                        systemView={currentFolderSystemView} 
                                        spaceId={spaceId} 
                                        spaceColor={space.color || "#4F6BFF"} 
                                    />
                                )}

                                {/* Normal content */}
                                {!currentFolderSystemView && (
                                    <div className="space-y-6">
                                        {/* Mobile: Show folders in grid */}
                                        {filteredFolders.length > 0 && (
                                            <div className="md:hidden">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Carpetas</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {filteredFolders.map((folder) => (
                                                        <motion.button key={folder.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigateToFolder(folder.id, { id: folder.id, name: folder.name, icon: folder.icon, parent_id: folder.parent_id, system_view: (folder as any).system_view || null })} className="p-3 rounded-xl border border-border bg-background hover:bg-accent text-left transition-all">
                                                            <Folder className="h-5 w-5 text-yellow-500 mb-2" />
                                                            <p className="text-sm font-medium truncate">{folder.name}</p>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {filteredNotes.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Notas</h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {filteredNotes.map((note) => (
                                                        <motion.button key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => handleOpenNote(note)} className="group p-4 rounded-xl border border-border bg-background hover:bg-accent hover:border-primary/20 text-left transition-all relative">
                                                            <button onClick={(e) => handleTogglePinned(note.id, e)} className={cn("absolute top-2 right-2 p-1 rounded-lg transition-all z-10", note.is_pinned ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-yellow-500")}>
                                                                <Star className={cn("h-4 w-4", note.is_pinned && "fill-yellow-500")} />
                                                            </button>
                                                            <StickyNote className="h-5 w-5 text-green-500 mb-2" />
                                                            <p className="font-medium truncate text-sm">{note.title}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(note.updated_at)}</p>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Files */}
                                        {filteredFiles.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Archivos</h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {filteredFiles.map((file) => {
                                                        const Icon = getFileIcon(file.type);
                                                        return (
                                                            <motion.div key={file.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group p-4 rounded-xl border border-border bg-background hover:bg-accent text-left transition-all relative">
                                                                <button onClick={() => toggleStar(file.id)} className={cn("absolute top-2 right-2 p-1 rounded-lg transition-all z-10", file.is_starred ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-yellow-500")}>
                                                                    <Star className={cn("h-4 w-4", file.is_starred && "fill-yellow-500")} />
                                                                </button>
                                                                <Icon className="h-5 w-5 text-blue-500 mb-2" />
                                                                <p className="font-medium truncate text-sm">{file.name}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size_bytes)}</p>
                                                                {file.url && <a href={file.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0" />}
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty state */}
                                        {filteredNotes.length === 0 && filteredFiles.length === 0 && (currentFolderId || filteredFolders.length === 0) && (
                                            <div className="text-center py-12">
                                                <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                                <p className="text-muted-foreground">{searchQuery ? "No se encontraron resultados" : "Esta carpeta está vacía"}</p>
                                                <button onClick={handleNewNote} className="mt-4 text-primary hover:underline">Crear una nota</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                    {/* TASKS TAB */}
                    {activeTab === "tasks" && (
                        <div className="p-4 space-y-6 border-t border-border">
                        <button onClick={() => setShowNewTaskModal(true)} className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                            <Plus className="h-5 w-5" />
                            Nueva tarea
                        </button>

                        {pendingTasks.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Pendientes ({pendingTasks.length})</h3>
                                <div className="space-y-2">
                                    {pendingTasks.map((task) => (
                                        <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent/50 transition-colors group">
                                            <button onClick={() => handleToggleTask(task.id, task.completed || false)} className="flex-shrink-0">
                                                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{task.title}</p>
                                                {task.due_date && (
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(task.due_date).toLocaleDateString("es")}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={cn("text-xs px-2 py-1 rounded-full", task.priority === "high" && "bg-red-500/10 text-red-500", task.priority === "medium" && "bg-yellow-500/10 text-yellow-600", task.priority === "low" && "bg-gray-500/10 text-gray-500")}>
                                                {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {completedTasks.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Completadas ({completedTasks.length})</h3>
                                <div className="space-y-2">
                                    {completedTasks.map((task) => (
                                        <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background/50 opacity-60 group">
                                            <button onClick={() => handleToggleTask(task.id, task.completed || false)} className="flex-shrink-0">
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            </button>
                                            <p className="flex-1 line-through text-muted-foreground">{task.title}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredTasks.length === 0 && (
                            <div className="text-center py-12">
                                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No hay tareas en este espacio</p>
                            </div>
                        )}
                    </div>
                )}

                    {/* GOALS TAB */}
                    {activeTab === "goals" && (
                        <div className="p-4 space-y-4 border-t border-border">
                        {filteredGoals.length > 0 ? (
                            filteredGoals.map((goal) => (
                                <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-border bg-background">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium">{goal.title}</h3>
                                        <span className={cn("text-xs px-2 py-1 rounded-full", goal.status === "active" && "bg-blue-500/10 text-blue-500", goal.status === "completed" && "bg-green-500/10 text-green-500", goal.status === "paused" && "bg-gray-500/10 text-gray-500")}>
                                            {goal.status === "active" ? "Activa" : goal.status === "completed" ? "Completada" : "Pausada"}
                                        </span>
                                    </div>
                                    {goal.description && <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${goal.progress || 0}%` }} />
                                        </div>
                                        <span className="text-sm font-medium">{goal.progress || 0}%</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No hay metas en este espacio</p>
                            </div>
                        )}
                        </div>
                    )}
                </div>
            </div>

            {/* New Folder Modal */}
            <AnimatePresence>
                {showNewFolderModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewFolderModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4">
                            <div className="bg-background rounded-2xl border border-border shadow-2xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Nueva carpeta</h3>
                                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Nombre de la carpeta" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4" autoFocus />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowNewFolderModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors">Cancelar</button>
                                    <button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="flex-1 btn-primary disabled:opacity-50">Crear</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* New Task Modal */}
            <AnimatePresence>
                {showNewTaskModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewTaskModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4">
                            <div className="bg-background rounded-2xl border border-border shadow-2xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Nueva tarea</h3>
                                <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Título de la tarea" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4" autoFocus />
                                <div className="mb-4">
                                    <label className="text-sm text-muted-foreground mb-2 block">Prioridad</label>
                                    <div className="flex gap-2">
                                        {(["low", "medium", "high"] as const).map((p) => (
                                            <button key={p} onClick={() => setNewTaskPriority(p)} className={cn("flex-1 px-3 py-2 rounded-xl border text-sm transition-all", newTaskPriority === p ? "border-primary bg-primary/10" : "border-border hover:bg-accent")}>
                                                {p === "high" ? "Alta" : p === "medium" ? "Media" : "Baja"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowNewTaskModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors">Cancelar</button>
                                    <button onClick={handleCreateTask} disabled={!newTaskTitle.trim()} className="flex-1 btn-primary disabled:opacity-50">Crear</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Note Editor */}
            <NoteEditor isOpen={isEditorOpen} onClose={() => { setIsEditorOpen(false); setEditingNote(null); }} onSave={handleSaveNote} initialTitle={editingNote?.title || ""} initialContent={editingNote?.content || ""} spaceColor={space.color || "#4F6BFF"} />

            {/* Context Modal */}
            <AnimatePresence>
                {isContextModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsContextModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[80vh] z-50 flex flex-col mx-4">
                            <div className="rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col max-h-full">
                                <div className="flex items-center justify-between p-4 border-b border-border">
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
                                    <pre className="p-4 text-sm overflow-x-auto whitespace-pre-wrap font-mono rounded-xl border border-border bg-muted/30">{generateContextText()}</pre>
                                </div>
                                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                                    <button onClick={handleDownloadContext} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors text-sm">
                                        <Download className="h-4 w-4" />
                                        Descargar
                                    </button>
                                    <button onClick={handleCopyContext} className="btn-primary flex items-center gap-2">
                                        {copied ? <><Check className="h-4 w-4" />¡Copiado!</> : <><Copy className="h-4 w-4" />Copiar</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
