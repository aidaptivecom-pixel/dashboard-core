"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Inbox, 
    Mail, 
    MessageCircle,
    Phone,
    Bot,
    AlertTriangle, 
    CheckCircle2,
    Trash2,
    FolderKanban,
    Search,
    Filter,
    MoreHorizontal,
    Send,
    Clock,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/context/WorkspaceContext";

type InboxCategory = "all" | "email" | "whatsapp" | "calls" | "pending_ai";

interface InboxItem {
    id: string;
    category: "email" | "whatsapp" | "call";
    from: string;
    subject?: string;
    preview: string;
    timestamp: string;
    isRead: boolean;
    isUrgent?: boolean;
    hasPendingAIResponse?: boolean;
    aiDraftResponse?: string;
}

// Mock data por workspace
const mockInboxData: Record<string, InboxItem[]> = {
    aidaptive: [
        {
            id: "1",
            category: "email",
            from: "cliente@empresa.com",
            subject: "Re: Propuesta automatización CRM",
            preview: "Hola, revisé la propuesta y tengo algunas preguntas sobre el timeline del proyecto...",
            timestamp: "Hace 1h",
            isRead: false,
            isUrgent: true,
        },
        {
            id: "2",
            category: "whatsapp",
            from: "+54 11 5555-1234",
            preview: "Hola, me pasaron tu contacto. Necesito automatizar mi negocio, ¿podemos hablar?",
            timestamp: "Hace 2h",
            isRead: false,
            hasPendingAIResponse: true,
            aiDraftResponse: "¡Hola! Gracias por contactarnos. Claro, me encantaría ayudarte con la automatización. ¿Podrías contarme un poco más sobre tu negocio y qué procesos te gustaría automatizar?",
        },
        {
            id: "3",
            category: "email",
            from: "lead@startup.io",
            subject: "Consulta servicios de IA",
            preview: "Vi tu perfil en LinkedIn y me interesa saber más sobre tus servicios de automatización con IA...",
            timestamp: "Hace 3h",
            isRead: false,
            hasPendingAIResponse: true,
            aiDraftResponse: "¡Hola! Gracias por tu interés. En Aidaptive nos especializamos en automatización con IA para startups. ¿Te gustaría agendar una llamada de 15 minutos para conocer mejor tus necesidades?",
        },
        {
            id: "4",
            category: "call",
            from: "+54 11 4444-5678",
            preview: "Llamada perdida - Duración: 0:00. Posible cliente nuevo.",
            timestamp: "Ayer",
            isRead: true,
        },
        {
            id: "5",
            category: "whatsapp",
            from: "Juan Pérez",
            preview: "Perfecto, quedamos así entonces. Te mando el pago mañana.",
            timestamp: "Ayer",
            isRead: true,
        },
    ],
    igreen: [
        {
            id: "6",
            category: "email",
            from: "proveedor@vivero.com",
            subject: "Cotización plantas de interior",
            preview: "Adjunto la cotización solicitada para las 50 plantas de interior...",
            timestamp: "Hace 4h",
            isRead: false,
        },
        {
            id: "7",
            category: "whatsapp",
            from: "+54 11 6666-7890",
            preview: "Hola! Vi sus productos en Instagram, ¿hacen envíos a zona norte?",
            timestamp: "Hace 5h",
            isRead: false,
            hasPendingAIResponse: true,
            aiDraftResponse: "¡Hola! Sí, hacemos envíos a toda zona norte. El costo de envío depende de la cantidad de productos. ¿Qué plantas te interesan?",
        },
    ],
    personal: [
        {
            id: "8",
            category: "email",
            from: "banco@notificaciones.com",
            subject: "Resumen de cuenta",
            preview: "Tu resumen de cuenta del mes de enero está disponible...",
            timestamp: "Hace 6h",
            isRead: true,
        },
    ],
};

const categoryConfig = {
    all: { label: "Todo", icon: Inbox, color: "text-foreground" },
    email: { label: "Email", icon: Mail, color: "text-blue-500" },
    whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "text-green-500" },
    calls: { label: "Llamadas", icon: Phone, color: "text-yellow-500" },
    pending_ai: { label: "Pendiente IA", icon: Bot, color: "text-purple" },
};

export default function InboxPage() {
    const { currentWorkspace } = useWorkspace();
    const [category, setCategory] = useState<InboxCategory>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);

    const items = mockInboxData[currentWorkspace.id] || [];
    
    const filteredItems = items.filter(item => {
        if (category === "pending_ai") return item.hasPendingAIResponse;
        if (category !== "all" && item.category !== category) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return item.from.toLowerCase().includes(query) || 
                   item.preview.toLowerCase().includes(query) ||
                   (item.subject?.toLowerCase().includes(query));
        }
        return true;
    });

    const pendingAICount = items.filter(i => i.hasPendingAIResponse).length;
    const unreadCount = items.filter(i => !i.isRead).length;

    const getCategoryIcon = (cat: string) => {
        if (cat === "email") return Mail;
        if (cat === "whatsapp") return MessageCircle;
        if (cat === "call") return Phone;
        return Inbox;
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <span 
                                className="text-2xl"
                                style={{ filter: `drop-shadow(0 0 8px ${currentWorkspace.color}40)` }}
                            >
                                {currentWorkspace.icon}
                            </span>
                            Inbox {currentWorkspace.name}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {unreadCount} sin leer • {pendingAICount} respuestas IA pendientes
                        </p>
                    </div>
                </div>

                {/* Search & Categories */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
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
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {(Object.keys(categoryConfig) as InboxCategory[]).map((cat) => {
                            const config = categoryConfig[cat];
                            const Icon = config.icon;
                            const count = cat === "pending_ai" 
                                ? pendingAICount 
                                : cat === "all" 
                                    ? items.length 
                                    : items.filter(i => i.category === cat).length;
                            
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                                        category === cat
                                            ? "bg-primary text-white"
                                            : "bg-muted hover:bg-accent"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {config.label}
                                    {count > 0 && (
                                        <span className={cn(
                                            "text-xs px-1.5 rounded-full",
                                            category === cat ? "bg-white/20" : "bg-background"
                                        )}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* List */}
                    <div className="space-y-2">
                        <AnimatePresence>
                            {filteredItems.map((item, index) => {
                                const Icon = getCategoryIcon(item.category);
                                
                                return (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedItem(item)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl border transition-all",
                                            selectedItem?.id === item.id
                                                ? "border-primary bg-primary/5"
                                                : item.isRead 
                                                    ? "border-border bg-background hover:bg-accent" 
                                                    : "border-primary/20 bg-primary/5 hover:bg-primary/10",
                                            item.isUrgent && !item.isRead && "border-coral/50 bg-coral/5"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "p-2 rounded-lg",
                                                item.category === "email" && "bg-blue-500/10 text-blue-500",
                                                item.category === "whatsapp" && "bg-green-500/10 text-green-500",
                                                item.category === "call" && "bg-yellow-500/10 text-yellow-500"
                                            )}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "font-medium truncate",
                                                        !item.isRead && "font-semibold"
                                                    )}>
                                                        {item.from}
                                                    </span>
                                                    {item.hasPendingAIResponse && (
                                                        <Bot className="h-4 w-4 text-purple flex-shrink-0" />
                                                    )}
                                                    {item.isUrgent && (
                                                        <AlertTriangle className="h-4 w-4 text-coral flex-shrink-0" />
                                                    )}
                                                </div>
                                                {item.subject && (
                                                    <p className="text-sm font-medium truncate">{item.subject}</p>
                                                )}
                                                <p className="text-sm text-muted-foreground truncate">{item.preview}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                                            </div>
                                        </div>
                                    </motion.button>
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

                    {/* Detail Panel */}
                    <div className="hidden lg:block">
                        {selectedItem ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-6 rounded-2xl border border-border bg-background h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{selectedItem.from}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {selectedItem.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-accent">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </div>

                                {selectedItem.subject && (
                                    <h3 className="text-lg font-semibold mb-4">{selectedItem.subject}</h3>
                                )}

                                <div className="p-4 rounded-xl bg-muted/50 mb-6">
                                    <p className="text-sm">{selectedItem.preview}</p>
                                </div>

                                {/* AI Draft Response */}
                                {selectedItem.hasPendingAIResponse && selectedItem.aiDraftResponse && (
                                    <div className="border-t border-border pt-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Bot className="h-5 w-5 text-purple" />
                                            <span className="font-medium text-purple">Respuesta sugerida por Claude</span>
                                        </div>
                                        <div className="p-4 rounded-xl border-2 border-purple/20 bg-purple/5 mb-4">
                                            <p className="text-sm">{selectedItem.aiDraftResponse}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
                                                <Send className="h-4 w-4" />
                                                Aprobar y enviar
                                            </button>
                                            <button className="btn-secondary py-2.5 px-4">
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {!selectedItem.hasPendingAIResponse && (
                                    <div className="flex gap-2">
                                        <button className="flex-1 btn-primary py-2.5">
                                            Responder
                                        </button>
                                        <button className="p-2.5 rounded-xl border border-border hover:bg-accent">
                                            <FolderKanban className="h-5 w-5" />
                                        </button>
                                        <button className="p-2.5 rounded-xl border border-border hover:bg-coral/10 hover:border-coral/50 hover:text-coral">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="p-6 rounded-2xl border border-dashed border-border h-full flex items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                    <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Selecciona un mensaje para ver los detalles</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
