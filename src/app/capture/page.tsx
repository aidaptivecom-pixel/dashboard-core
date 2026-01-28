"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Mic, Image as ImageIcon, FileText, Link2, Lightbulb, Send, Trash2, FolderOpen, Sparkles, Upload, Square, Clock, X, Filter, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaptures } from "@/hooks/useCaptures";
import { useSpaces } from "@/hooks/useSpaces";

const typeConfig = {
    note: { icon: FileText, color: "text-blue-500 bg-blue-500/10", label: "Nota", plural: "notas" },
    voice: { icon: Mic, color: "text-green-500 bg-green-500/10", label: "Audio", plural: "audios" },
    image: { icon: ImageIcon, color: "text-pink-500 bg-pink-500/10", label: "Imagen", plural: "imágenes" },
    link: { icon: Link2, color: "text-purple bg-purple/10", label: "Link", plural: "links" },
    idea: { icon: Lightbulb, color: "text-yellow-500 bg-yellow-500/10", label: "Idea", plural: "ideas" },
};

type FilterType = "all" | "idea" | "voice" | "image" | "link" | "note";

function formatTimeAgo(date: string | null): string {
    if (!date) return "";
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    return `Hace ${diffDays} días`;
}

export default function CapturePage() {
    const { captures, loading, createCapture, deleteCapture, markAsProcessed } = useCaptures();
    const { spaces } = useSpaces();
    const [newCapture, setNewCapture] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [filter, setFilter] = useState<FilterType>("all");
    const [showMoveModal, setShowMoveModal] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const recordingInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRecording) {
            recordingInterval.current = setInterval(() => {
                setRecordingTime(t => t + 1);
            }, 1000);
        } else {
            if (recordingInterval.current) clearInterval(recordingInterval.current);
        }
        return () => { if (recordingInterval.current) clearInterval(recordingInterval.current); };
    }, [isRecording]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newCapture.trim() && !imagePreview) return;

        const isLink = newCapture.trim().startsWith("http");
        
        await createCapture({
            type: imagePreview ? "image" : isLink ? "link" : "idea",
            content: newCapture.trim() || "Imagen capturada",
            image_url: imagePreview || undefined,
        });

        setNewCapture("");
        setImagePreview(null);
    };

    const handleDelete = async (id: string) => {
        await deleteCapture(id);
    };

    const handleMove = async (captureId: string, spaceId: string) => {
        await markAsProcessed(captureId, spaceId);
        setShowMoveModal(null);
    };

    const toggleRecording = async () => {
        if (isRecording) {
            await createCapture({
                type: "voice",
                content: `Nota de voz (${formatTime(recordingTime)})`,
                transcription: "Transcripción pendiente...",
            });
            setRecordingTime(0);
        }
        setIsRecording(!isRecording);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith("image")) {
                const reader = new FileReader();
                reader.onload = (e) => setImagePreview(e.target?.result as string);
                reader.readAsDataURL(file);
            } else {
                await createCapture({ type: "note", content: file.name });
            }
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            if (file.type.startsWith("image")) {
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    await createCapture({
                        type: "image",
                        content: file.name,
                        image_url: ev.target?.result as string,
                    });
                };
                reader.readAsDataURL(file);
            } else {
                await createCapture({ type: "note", content: file.name });
            }
        }
    };

    const focusCaptureInput = () => {
        if (window.innerWidth < 768) {
            mobileInputRef.current?.focus();
        } else {
            textareaRef.current?.focus();
        }
    };

    const filteredCaptures = filter === "all" ? captures : captures.filter(c => c.type === filter);

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
                <div className="mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Inbox className="h-7 w-7" />
                        Captura
                    </h1>
                    <p className="text-muted-foreground">Tu inbox de ideas. Captura rápido, organiza después.</p>
                </div>

                <AnimatePresence>
                    {isRecording && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-coral animate-pulse" />
                                <span className="text-coral font-medium">Grabando...</span>
                                <span className="text-coral/70 font-mono text-lg">{formatTime(recordingTime)}</span>
                            </div>
                            <button onClick={toggleRecording} className="px-4 py-2 rounded-xl bg-coral text-white font-medium flex items-center gap-2">
                                <Square className="h-4 w-4" />
                                Detener
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {imagePreview && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-4 relative">
                            <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-2xl border border-border" />
                            <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="mb-6 hidden md:block">
                    <div className="relative">
                        <textarea ref={textareaRef} placeholder="Escribe una idea, pega un link, o arrastra una imagen..." value={newCapture} onChange={(e) => setNewCapture(e.target.value)} rows={3} className="w-full px-4 py-4 pr-36 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg resize-none" />
                        <div className="absolute right-3 bottom-3 flex items-center gap-1">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl hover:bg-accent transition-colors" title="Subir imagen">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button type="button" onClick={toggleRecording} className={cn("p-2.5 rounded-xl transition-colors", isRecording ? "bg-coral text-white" : "hover:bg-accent")} title="Grabar audio">
                                <Mic className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button type="submit" disabled={!newCapture.trim() && !imagePreview} className="p-2.5 rounded-xl bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </form>

                <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={cn("mb-6 p-6 rounded-2xl border-2 border-dashed transition-all text-center hidden md:block", dragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-muted-foreground/50")}>
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-sm">Arrastra archivos o screenshots aquí</p>
                </div>

                <div className="flex gap-1.5 md:gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {(["all", "idea", "voice", "image", "link", "note"] as FilterType[]).map((f) => {
                        const config = f === "all" ? { icon: Filter, label: "Todo" } : typeConfig[f];
                        const Icon = config.icon;
                        const count = filterCounts[f];
                        return (
                            <button key={f} onClick={() => setFilter(f)} className={cn("flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all", filter === f ? "bg-primary text-white" : "bg-muted hover:bg-accent")}>
                                <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                                {config.label}
                                {count > 0 && <span className={cn("text-xs px-1.5 rounded-full", filter === f ? "bg-white/20" : "bg-background")}>{count}</span>}
                            </button>
                        );
                    })}
                </div>

                {filteredCaptures.length > 0 && (
                    <div className="flex justify-end mb-4">
                        <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            Organizar todo con IA
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-12"><p className="text-muted-foreground">Cargando...</p></div>
                    ) : (
                        <AnimatePresence>
                            {filteredCaptures.map((capture, index) => {
                                const config = typeConfig[capture.type];
                                const Icon = config.icon;
                                const suggestedSpace = spaces.find(s => s.id === capture.suggested_space_id);

                                return (
                                    <motion.div key={capture.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: index * 0.03 }} className="p-4 rounded-2xl border border-border bg-background group">
                                        <div className="flex items-start gap-4">
                                            <div className={cn("p-2.5 rounded-xl flex-shrink-0", config.color)}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {capture.image_url && (
                                                    <img src={capture.image_url} alt={capture.content} className="w-full max-h-48 object-cover rounded-xl mb-3" />
                                                )}
                                                <p className={cn("font-medium", capture.type === "link" && "text-primary underline")}>{capture.content}</p>
                                                {capture.transcription && (
                                                    <p className="text-sm text-muted-foreground mt-2 p-3 rounded-xl bg-muted/50">{capture.transcription}</p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTimeAgo(capture.created_at)}
                                                    </span>
                                                    {suggestedSpace && (
                                                        <button onClick={() => handleMove(capture.id, suggestedSpace.id)} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1">
                                                            <Sparkles className="h-3 w-3" />
                                                            Mover a {suggestedSpace.icon} {suggestedSpace.name}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="relative">
                                                    <button onClick={() => setShowMoveModal(showMoveModal === capture.id ? null : capture.id)} className="p-2 rounded-lg hover:bg-accent transition-colors" title="Mover a espacio">
                                                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                                    </button>
                                                    <AnimatePresence>
                                                        {showMoveModal === capture.id && (
                                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-full mt-2 p-2 rounded-xl border border-border bg-background shadow-lg z-10 min-w-[180px]">
                                                                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Mover a:</p>
                                                                {spaces.map(space => (
                                                                    <button key={space.id} onClick={() => handleMove(capture.id, space.id)} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                                                                        <span>{space.icon}</span>
                                                                        <span>{space.name}</span>
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button onClick={() => handleDelete(capture.id)} className="p-2 rounded-lg hover:bg-coral/10 transition-colors" title="Eliminar">
                                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-coral" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}

                    {!loading && filteredCaptures.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-5">
                                <Inbox className="h-10 w-10 text-primary/40" />
                            </div>
                            <p className="text-lg font-medium mb-1">{filter === "all" ? "No hay capturas pendientes" : `No hay ${typeConfig[filter as keyof typeof typeConfig]?.plural}`}</p>
                            <p className="text-muted-foreground text-sm mb-6">Tocá + para capturar una idea</p>
                            <button
                                onClick={focusCaptureInput}
                                className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-2xl font-light"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden z-50">
                    <div className="flex items-center gap-2 max-w-3xl mx-auto">
                        <input ref={mobileInputRef} type="text" placeholder="Capturar idea..." value={newCapture} onChange={(e) => setNewCapture(e.target.value)} className="flex-1 px-4 py-3 rounded-2xl border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <button onClick={() => cameraInputRef.current?.click()} className="p-3 rounded-2xl bg-muted hover:bg-accent transition-colors">
                            <Camera className="h-5 w-5" />
                        </button>
                        <button onClick={toggleRecording} className={cn("p-3 rounded-2xl transition-colors", isRecording ? "bg-coral text-white" : "bg-muted hover:bg-accent")}>
                            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </button>
                        <button onClick={() => handleSubmit()} disabled={!newCapture.trim()} className="p-3 rounded-2xl bg-primary text-white disabled:opacity-50">
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
