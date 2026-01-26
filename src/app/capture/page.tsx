"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Inbox,
    Mic,
    Image as ImageIcon,
    FileText,
    Link2,
    Lightbulb,
    Send,
    Trash2,
    FolderOpen,
    Sparkles,
    Upload,
    Square,
    Clock,
    X,
    Check,
    Filter,
    Camera,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CaptureItem {
    id: string;
    type: "note" | "voice" | "image" | "link" | "idea";
    content: string;
    createdAt: string;
    timestamp: Date;
    transcription?: string;
    suggestedSpace?: string;
    imageUrl?: string;
}

const spaces = [
    { id: "aidaptive", name: "Aidaptive", icon: "🤖" },
    { id: "igreen", name: "iGreen", icon: "🌱" },
    { id: "limbo", name: "Limbo", icon: "🚀" },
    { id: "personal", name: "Personal", icon: "👤" },
];

const mockCaptures: CaptureItem[] = [
    {
        id: "1",
        type: "idea",
        content: "Agregar integración con Notion para sincronizar notas automáticamente",
        createdAt: "Hace 10min",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        suggestedSpace: "aidaptive",
    },
    {
        id: "2",
        type: "voice",
        content: "Nota de voz - Ideas para landing",
        createdAt: "Hace 1h",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        transcription: "Necesito agregar una sección de testimonios en la landing de Limbo, también revisar los colores del hero y hacer que el CTA sea más visible. Pensar en agregar un video demo.",
        suggestedSpace: "limbo",
    },
    {
        id: "3",
        type: "image",
        content: "Screenshot diseño competidor",
        createdAt: "Hace 2h",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        suggestedSpace: "limbo",
        imageUrl: "https://placehold.co/400x300/1a1a2e/ffffff?text=Screenshot",
    },
    {
        id: "4",
        type: "link",
        content: "https://ui.shadcn.com/docs/components/button",
        createdAt: "Hace 3h",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        suggestedSpace: "limbo",
    },
    {
        id: "5",
        type: "note",
        content: "Revisar precios de proveedores de macetas - pedir cotización a 3 mínimo",
        createdAt: "Ayer",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        suggestedSpace: "igreen",
    },
];

const typeConfig = {
    note: { icon: FileText, color: "text-blue-500 bg-blue-500/10", label: "Nota" },
    voice: { icon: Mic, color: "text-green-500 bg-green-500/10", label: "Audio" },
    image: { icon: ImageIcon, color: "text-pink-500 bg-pink-500/10", label: "Imagen" },
    link: { icon: Link2, color: "text-purple bg-purple/10", label: "Link" },
    idea: { icon: Lightbulb, color: "text-yellow-500 bg-yellow-500/10", label: "Idea" },
};

type FilterType = "all" | "idea" | "voice" | "image" | "link" | "note";

export default function CapturePage() {
    const [captures, setCaptures] = useState(mockCaptures);
    const [newCapture, setNewCapture] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [filter, setFilter] = useState<FilterType>("all");
    const [showMoveModal, setShowMoveModal] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const recordingInterval = useRef<NodeJS.Timeout | null>(null);

    // Recording timer
    useEffect(() => {
        if (isRecording) {
            recordingInterval.current = setInterval(() => {
                setRecordingTime(t => t + 1);
            }, 1000);
        } else {
            if (recordingInterval.current) {
                clearInterval(recordingInterval.current);
            }
        }
        return () => {
            if (recordingInterval.current) {
                clearInterval(recordingInterval.current);
            }
        };
    }, [isRecording]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCapture.trim() && !imagePreview) return;

        const isLink = newCapture.trim().startsWith("http");
        
        const capture: CaptureItem = {
            id: Date.now().toString(),
            type: imagePreview ? "image" : isLink ? "link" : "idea",
            content: newCapture.trim() || "Imagen capturada",
            createdAt: "Ahora",
            timestamp: new Date(),
            imageUrl: imagePreview || undefined,
            suggestedSpace: suggestSpace(newCapture),
        };

        setCaptures([capture, ...captures]);
        setNewCapture("");
        setImagePreview(null);
    };

    const suggestSpace = (content: string): string | undefined => {
        const lower = content.toLowerCase();
        if (lower.includes("cliente") || lower.includes("automatiz") || lower.includes("crm") || lower.includes("ia")) {
            return "aidaptive";
        }
        if (lower.includes("planta") || lower.includes("maceta") || lower.includes("vivero") || lower.includes("green")) {
            return "igreen";
        }
        if (lower.includes("landing") || lower.includes("limbo") || lower.includes("diseño") || lower.includes("ui")) {
            return "limbo";
        }
        return undefined;
    };

    const handleDelete = (id: string) => {
        setCaptures(captures.filter(c => c.id !== id));
    };

    const handleMove = (captureId: string, spaceId: string) => {
        // En producción, esto movería el item al espacio
        setCaptures(captures.filter(c => c.id !== captureId));
        setShowMoveModal(null);
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop recording
            const capture: CaptureItem = {
                id: Date.now().toString(),
                type: "voice",
                content: `Nota de voz (${formatTime(recordingTime)})`,
                createdAt: "Ahora",
                timestamp: new Date(),
                transcription: "Transcribiendo... (esto usará Whisper en producción)",
            };
            setCaptures([capture, ...captures]);
            setRecordingTime(0);
        }
        setIsRecording(!isRecording);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith("image")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                const capture: CaptureItem = {
                    id: Date.now().toString(),
                    type: "note",
                    content: file.name,
                    createdAt: "Ahora",
                    timestamp: new Date(),
                };
                setCaptures([capture, ...captures]);
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            if (file.type.startsWith("image")) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const capture: CaptureItem = {
                        id: Date.now().toString() + Math.random(),
                        type: "image",
                        content: file.name,
                        createdAt: "Ahora",
                        timestamp: new Date(),
                        imageUrl: ev.target?.result as string,
                    };
                    setCaptures(prev => [capture, ...prev]);
                };
                reader.readAsDataURL(file);
            } else {
                const capture: CaptureItem = {
                    id: Date.now().toString() + Math.random(),
                    type: "note",
                    content: file.name,
                    createdAt: "Ahora",
                    timestamp: new Date(),
                };
                setCaptures(prev => [capture, ...prev]);
            }
        });
    };

    const filteredCaptures = filter === "all" 
        ? captures 
        : captures.filter(c => c.type === filter);

    const filterCounts = {
        all: captures.length,
        idea: captures.filter(c => c.type === "idea").length,
        voice: captures.filter(c => c.type === "voice").length,
        image: captures.filter(c => c.type === "image").length,
        link: captures.filter(c => c.type === "link").length,
        note: captures.filter(c => c.type === "note").length,
    };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto pb-32 md:pb-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Inbox className="h-7 w-7" />
                        Captura
                    </h1>
                    <p className="text-muted-foreground">
                        Tu inbox de ideas. Captura rápido, organiza después.
                    </p>
                </div>

                {/* Recording indicator */}
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-coral animate-pulse" />
                                <span className="text-coral font-medium">Grabando...</span>
                                <span className="text-coral/70 font-mono text-lg">{formatTime(recordingTime)}</span>
                            </div>
                            <button
                                onClick={toggleRecording}
                                className="px-4 py-2 rounded-xl bg-coral text-white font-medium flex items-center gap-2"
                            >
                                <Square className="h-4 w-4" />
                                Detener
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Image Preview */}
                <AnimatePresence>
                    {imagePreview && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-4 relative"
                        >
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full max-h-64 object-cover rounded-2xl border border-border"
                            />
                            <button
                                onClick={() => setImagePreview(null)}
                                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Capture Form - Desktop */}
                <form onSubmit={handleSubmit} className="mb-6 hidden md:block">
                    <div className="relative">
                        <textarea
                            placeholder="Escribe una idea, pega un link, o arrastra una imagen..."
                            value={newCapture}
                            onChange={(e) => setNewCapture(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-4 pr-36 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg resize-none"
                        />
                        <div className="absolute right-3 bottom-3 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 rounded-xl hover:bg-accent transition-colors"
                                title="Subir imagen"
                            >
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button
                                type="button"
                                onClick={toggleRecording}
                                className={cn(
                                    "p-2.5 rounded-xl transition-colors",
                                    isRecording ? "bg-coral text-white" : "hover:bg-accent"
                                )}
                                title="Grabar audio"
                            >
                                <Mic className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button
                                type="submit"
                                disabled={!newCapture.trim() && !imagePreview}
                                className="p-2.5 rounded-xl bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </form>

                {/* Drop Zone - Desktop */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={cn(
                        "mb-6 p-6 rounded-2xl border-2 border-dashed transition-all text-center hidden md:block",
                        dragOver 
                            ? "border-primary bg-primary/5 scale-[1.02]" 
                            : "border-border hover:border-muted-foreground/50"
                    )}
                >
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-sm">
                        Arrastra archivos o screenshots aquí
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                    {(["all", "idea", "voice", "image", "link", "note"] as FilterType[]).map((f) => {
                        const config = f === "all" ? { icon: Filter, label: "Todo" } : typeConfig[f];
                        const Icon = config.icon;
                        const count = filterCounts[f];
                        
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                                    filter === f
                                        ? "bg-primary text-white"
                                        : "bg-muted hover:bg-accent"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {config.label}
                                {count > 0 && (
                                    <span className={cn(
                                        "text-xs px-1.5 rounded-full",
                                        filter === f ? "bg-white/20" : "bg-background"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Organize with AI button */}
                {filteredCaptures.length > 0 && (
                    <div className="flex justify-end mb-4">
                        <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            Organizar todo con IA
                        </button>
                    </div>
                )}

                {/* Captures List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredCaptures.map((capture, index) => {
                            const config = typeConfig[capture.type];
                            const Icon = config.icon;
                            const suggestedSpaceData = spaces.find(s => s.id === capture.suggestedSpace);

                            return (
                                <motion.div
                                    key={capture.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="p-4 rounded-2xl border border-border bg-background group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn("p-2.5 rounded-xl flex-shrink-0", config.color)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {/* Image preview */}
                                            {capture.imageUrl && (
                                                <img 
                                                    src={capture.imageUrl} 
                                                    alt={capture.content}
                                                    className="w-full max-h-48 object-cover rounded-xl mb-3"
                                                />
                                            )}
                                            
                                            {/* Content */}
                                            <p className={cn(
                                                "font-medium",
                                                capture.type === "link" && "text-primary underline"
                                            )}>
                                                {capture.content}
                                            </p>
                                            
                                            {/* Transcription */}
                                            {capture.transcription && (
                                                <p className="text-sm text-muted-foreground mt-2 p-3 rounded-xl bg-muted/50">
                                                    {capture.transcription}
                                                </p>
                                            )}
                                            
                                            {/* Meta info */}
                                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {capture.createdAt}
                                                </span>
                                                
                                                {/* AI Suggestion */}
                                                {suggestedSpaceData && (
                                                    <button
                                                        onClick={() => handleMove(capture.id, suggestedSpaceData.id)}
                                                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                                                    >
                                                        <Sparkles className="h-3 w-3" />
                                                        Mover a {suggestedSpaceData.icon} {suggestedSpaceData.name}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setShowMoveModal(showMoveModal === capture.id ? null : capture.id)}
                                                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                                                    title="Mover a espacio"
                                                >
                                                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                                
                                                {/* Move Modal */}
                                                <AnimatePresence>
                                                    {showMoveModal === capture.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="absolute right-0 top-full mt-2 p-2 rounded-xl border border-border bg-background shadow-lg z-10 min-w-[180px]"
                                                        >
                                                            <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                                                                Mover a:
                                                            </p>
                                                            {spaces.map(space => (
                                                                <button
                                                                    key={space.id}
                                                                    onClick={() => handleMove(capture.id, space.id)}
                                                                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                                                                >
                                                                    <span>{space.icon}</span>
                                                                    <span>{space.name}</span>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(capture.id)}
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

                    {filteredCaptures.length === 0 && (
                        <div className="text-center py-12">
                            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">
                                {filter === "all" ? "No hay capturas pendientes" : `No hay ${typeConfig[filter as keyof typeof typeConfig]?.label.toLowerCase()}s`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Hidden file inputs */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Mobile Fixed Bottom Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden z-50">
                    <div className="flex items-center gap-2 max-w-3xl mx-auto">
                        <input
                            type="text"
                            placeholder="Capturar idea..."
                            value={newCapture}
                            onChange={(e) => setNewCapture(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-2xl border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="p-3 rounded-2xl bg-muted hover:bg-accent transition-colors"
                        >
                            <Camera className="h-5 w-5" />
                        </button>
                        <button
                            onClick={toggleRecording}
                            className={cn(
                                "p-3 rounded-2xl transition-colors",
                                isRecording ? "bg-coral text-white" : "bg-muted hover:bg-accent"
                            )}
                        >
                            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!newCapture.trim()}
                            className="p-3 rounded-2xl bg-primary text-white disabled:opacity-50"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
