"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Inbox, 
    Mail, 
    AlertTriangle, 
    FileText, 
    Link2, 
    Image,
    Mic,
    CheckCircle2,
    Trash2,
    FolderKanban,
    Clock,
    Filter,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";

type InboxItemType = "email" | "alert" | "capture" | "link" | "voice" | "idea";
type InboxFilter = "all" | "urgent" | "emails" | "captures";

interface InboxItem {
    id: string;
    type: InboxItemType;
    title: string;
    preview: string;
    source?: string;
    timestamp: string;
    isUrgent?: boolean;
    isRead?: boolean;
}

// Mock data
const mockInboxItems: InboxItem[] = [
    {
        id: "1",
        type: "alert",
        title: "Deploy falló en producción",
        preview: "Error en el pipeline de CI/CD. Build #1234 falló en el paso de tests.",
        source: "GitHub Actions",
        timestamp: "Hace 2 horas",
        isUrgent: true,
        isRead: false,
    },
    {
        id: "2",
        type: "email",
        title: "Re: Propuesta proyecto Q1",
        preview: "Hola, revisé la propuesta y tengo algunas preguntas sobre el timeline...",
        source: "cliente@empresa.com",
        timestamp: "Hace 3 horas",
        isUrgent: true,
        isRead: false,
    },
    {
        id: "3",
        type: "capture",
        title: "Screenshot - Diseño dashboard",
        preview: "Captura de pantalla guardada",
        timestamp: "Ayer",
        isRead: false,
    },
    {
        id: "4",
        type: "link",
        title: "Artículo: State of AI 2025",
        preview: "https://example.com/state-of-ai-2025",
        source: "Twitter",
        timestamp: "Ayer",
        isRead: true,
    },
    {
        id: "5",
        type: "voice",
        title: "Nota de voz - Ideas producto",
        preview: "Duración: 2:34",
        timestamp: "Hace 2 días",
        isRead: true,
    },
    {
        id: "6",
        type: "email",
        title: "Newsletter semanal",
        preview: "Las últimas novedades en tecnología y startups...",
        source: "newsletter@tech.com",
        timestamp: "Hace 2 días",
        isRead: true,
    },
];

const getTypeIcon = (type: InboxItemType) => {
    switch (type) {
        case "email": return Mail;
        case "alert": return AlertTriangle;
        case "capture": return Image;
        case "link": return Link2;
        case "voice": return Mic;
        default: return FileText;
    }
};

const getTypeColor = (type: InboxItemType, isUrgent?: boolean) => {
    if (isUrgent) return "text-coral bg-coral/10";
    switch (type) {
        case "email": return "text-primary bg-primary/10";
        case "alert": return "text-coral bg-coral/10";
        case "capture": return "text-mint bg-mint/10";
        case "link": return "text-purple bg-purple/10";
        case "voice": return "text-yellow-500 bg-yellow-500/10";
        default: return "text-muted-foreground bg-muted";
    }
};

export default function InboxPage() {
    const [items, setItems] = useState(mockInboxItems);
    const [filter, setFilter] = useState<InboxFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items.filter(item => {
        if (filter === "urgent") return item.isUrgent;
        if (filter === "emails") return item.type === "email";
        if (filter === "captures") return ["capture", "link", "voice"].includes(item.type);
        return true;
    }).filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const urgentCount = items.filter(i => i.isUrgent && !i.isRead).length;
    const unreadCount = items.filter(i => !i.isRead).length;

    const markAsRead = (id: string) => {
        setItems(items.map(i => i.id === id ? { ...i, isRead: true } : i));
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const processItem = (id: string) => {
        // TODO: Open modal to assign to project/task
        markAsRead(id);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Inbox className="h-7 w-7" />
                            Inbox
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {unreadCount} sin leer • {urgentCount} urgentes
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar en inbox..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "urgent", "emails", "captures"] as InboxFilter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                    filter === f
                                        ? "bg-primary text-white"
                                        : "bg-muted hover:bg-accent"
                                )}
                            >
                                {f === "all" && "Todo"}
                                {f === "urgent" && `Urgente (${urgentCount})`}
                                {f === "emails" && "Emails"}
                                {f === "captures" && "Capturas"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Inbox Items */}
                <div className="space-y-2">
                    <AnimatePresence>
                        {filteredItems.map((item, index) => {
                            const Icon = getTypeIcon(item.type);
                            const colorClass = getTypeColor(item.type, item.isUrgent);
                            
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "group p-4 rounded-2xl border transition-all",
                                        item.isRead 
                                            ? "bg-background border-border" 
                                            : "bg-primary/5 border-primary/20",
                                        item.isUrgent && !item.isRead && "border-coral/50 bg-coral/5"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={cn("p-2 rounded-xl", colorClass)}>
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className={cn(
                                                        "font-medium",
                                                        !item.isRead && "font-semibold"
                                                    )}>
                                                        {item.title}
                                                    </h3>
                                                    {item.source && (
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {item.source}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {item.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                {item.preview}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => processItem(item.id)}
                                                className="p-2 rounded-lg hover:bg-accent transition-colors"
                                                title="Procesar"
                                            >
                                                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button 
                                                onClick={() => markAsRead(item.id)}
                                                className="p-2 rounded-lg hover:bg-accent transition-colors"
                                                title="Marcar como leído"
                                            >
                                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button 
                                                onClick={() => deleteItem(item.id)}
                                                className="p-2 rounded-lg hover:bg-coral/10 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-coral" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery ? "No se encontraron resultados" : "Inbox vacío"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
