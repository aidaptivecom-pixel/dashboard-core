"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Inbox,
    Mic,
    Image,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CaptureItem {
    id: string;
    type: "note" | "voice" | "image" | "link" | "idea";
    content: string;
    createdAt: string;
    transcription?: string;
    suggestedSpace?: string;
}

const mockCaptures: CaptureItem[] = [
    {
        id: "1",
        type: "idea",
        content: "Agregar integración con Notion para sincronizar notas",
        createdAt: "Hace 10min",
        suggestedSpace: "Aidaptive",
    },
    {
        id: "2",
        type: "voice",
        content: "Nota de voz - Ideas para landing",
        createdAt: "Hace 1h",
        transcription: "Necesito agregar una sección de testimonios en la landing de Limbo...",
        suggestedSpace: "Limbo",
    },
    {
        id: "3",
        type: "image",
        content: "Screenshot diseño competidor",
        createdAt: "Hace 2h",
        suggestedSpace: "Limbo",
    },
];

const typeConfig = {
    note: { icon: FileText, color: "text-blue-500 bg-blue-500/10", label: "Nota" },
    voice: { icon: Mic, color: "text-green-500 bg-green-500/10", label: "Audio" },
    image: { icon: Image, color: "text-pink-500 bg-pink-500/10", label: "Imagen" },
    link: { icon: Link2, color: "text-purple bg-purple/10", label: "Link" },
    idea: { icon: Lightbulb, color: "text-yellow-500 bg-yellow-500/10", label: "Idea" },
};

export default function CapturePage() {
    const [captures, setCaptures] = useState(mockCaptures);
    const [newCapture, setNewCapture] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCapture.trim()) return;

        const capture: CaptureItem = {
            id: Date.now().toString(),
            type: newCapture.startsWith("http") ? "link" : "idea",
            content: newCapture,
            createdAt: "Ahora",
        };

        setCaptures([capture, ...captures]);
        setNewCapture("");
    };

    const handleDelete = (id: string) => {
        setCaptures(captures.filter(c => c.id !== id));
    };

    const toggleRecording = () => {
        if (isRecording) {
            const capture: CaptureItem = {
                id: Date.now().toString(),
                type: "voice",
                content: "Nota de voz",
                createdAt: "Ahora",
                transcription: "Transcripción pendiente...",
            };
            setCaptures([capture, ...captures]);
        }
        setIsRecording(!isRecording);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            const capture: CaptureItem = {
                id: Date.now().toString() + Math.random(),
                type: file.type.startsWith("image") ? "image" : "note",
                content: file.name,
                createdAt: "Ahora",
            };
            setCaptures(prev => [capture, ...prev]);
        });
    };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Inbox className="h-7 w-7" />
                        Captura
                    </h1>
                    <p className="text-muted-foreground">
                        Tu inbox de ideas. Captura rápido, organiza después.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Escribe una idea, pega un link..."
                            value={newCapture}
                            onChange={(e) => setNewCapture(e.target.value)}
                            className="w-full pl-4 pr-32 py-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-xl hover:bg-accent transition-colors"
                            >
                                <Image className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button
                                type="button"
                                onClick={toggleRecording}
                                className={cn(
                                    "p-2 rounded-xl transition-colors",
                                    isRecording ? "bg-coral text-white" : "hover:bg-accent"
                                )}
                            >
                                {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
                            </button>
                            <button
                                type="submit"
                                disabled={!newCapture.trim()}
                                className="p-2 rounded-xl bg-primary text-white disabled:opacity-50"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const capture: CaptureItem = {
                                    id: Date.now().toString(),
                                    type: "image",
                                    content: file.name,
                                    createdAt: "Ahora",
                                };
                                setCaptures([capture, ...captures]);
                            }
                        }}
                    />
                </form>

                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-center gap-3"
                        >
                            <div className="w-3 h-3 rounded-full bg-coral animate-pulse" />
                            <span className="text-coral font-medium">Grabando...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={cn(
                        "mb-6 p-8 rounded-2xl border-2 border-dashed transition-colors text-center",
                        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"
                    )}
                >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Arrastra archivos o screenshots aquí</p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-muted-foreground">{captures.length} items</h2>
                        {captures.length > 0 && (
                            <button className="text-sm text-primary hover:underline flex items-center gap-1">
                                <Sparkles className="h-4 w-4" />
                                Organizar con IA
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {captures.map((capture, index) => {
                            const config = typeConfig[capture.type];
                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={capture.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-2xl border border-border bg-background group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn("p-2 rounded-xl", config.color)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">{capture.content}</p>
                                            {capture.transcription && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {capture.transcription}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {capture.createdAt}
                                                </span>
                                                {capture.suggestedSpace && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                        → {capture.suggestedSpace}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                                                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(capture.id)}
                                                className="p-2 rounded-lg hover:bg-coral/10 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-coral" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {captures.length === 0 && (
                        <div className="text-center py-12">
                            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No hay capturas pendientes</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
