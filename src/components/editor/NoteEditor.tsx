"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Save,
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Code,
    Link,
    Image,
    Quote,
    Minus,
    Eye,
    Edit3,
    Check,
    Maximize2,
    Minimize2,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: { title: string; content: string }) => void;
    initialTitle?: string;
    initialContent?: string;
    spaceColor?: string;
}

const toolbarButtons = [
    { icon: Bold, label: "Negrita", action: "**", wrap: true },
    { icon: Italic, label: "Cursiva", action: "_", wrap: true },
    { icon: Code, label: "Código", action: "`", wrap: true },
    { divider: true },
    { icon: Heading1, label: "Título 1", action: "# ", prefix: true },
    { icon: Heading2, label: "Título 2", action: "## ", prefix: true },
    { divider: true },
    { icon: List, label: "Lista", action: "- ", prefix: true },
    { icon: ListOrdered, label: "Lista numerada", action: "1. ", prefix: true },
    { icon: Quote, label: "Cita", action: "> ", prefix: true },
    { divider: true },
    { icon: Link, label: "Enlace", action: "[texto](url)", insert: true },
    { icon: Image, label: "Imagen", action: "![alt](url)", insert: true },
    { icon: Minus, label: "Línea", action: "\n---\n", insert: true },
];

export function NoteEditor({ 
    isOpen, 
    onClose, 
    onSave, 
    initialTitle = "", 
    initialContent = "",
    spaceColor = "#4F6BFF"
}: NoteEditorProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isPreview, setIsPreview] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setContent(initialContent);
            setIsPreview(false);
            setLastSaved(null);
        }
    }, [isOpen, initialTitle, initialContent]);

    // Auto-save draft
    useEffect(() => {
        if (!isOpen || !content) return;
        
        const timer = setTimeout(() => {
            localStorage.setItem(`note-draft-${initialTitle || 'new'}`, JSON.stringify({ title, content }));
        }, 2000);

        return () => clearTimeout(timer);
    }, [title, content, isOpen, initialTitle]);

    const handleToolbarAction = (button: typeof toolbarButtons[0]) => {
        if (!textareaRef.current || 'divider' in button) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let newContent = content;
        let newCursorPos = start;

        if (button.wrap) {
            // Wrap selected text
            const wrappedText = `${button.action}${selectedText}${button.action}`;
            newContent = content.substring(0, start) + wrappedText + content.substring(end);
            newCursorPos = start + button.action.length + selectedText.length + button.action.length;
        } else if (button.prefix) {
            // Add at line start
            const lineStart = content.lastIndexOf('\n', start - 1) + 1;
            newContent = content.substring(0, lineStart) + button.action + content.substring(lineStart);
            newCursorPos = start + button.action.length;
        } else if (button.insert) {
            // Insert at cursor
            newContent = content.substring(0, start) + button.action + content.substring(end);
            newCursorPos = start + button.action.length;
        }

        setContent(newContent);
        
        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
        onSave({ title, content });
        setLastSaved(new Date());
        setIsSaving(false);
        localStorage.removeItem(`note-draft-${initialTitle || 'new'}`);
    };

    const renderMarkdownPreview = (text: string) => {
        // Simple markdown to HTML conversion
        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
            // Bold & Italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            // Code
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
            // Links & Images
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-2" />')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
            // Lists
            .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4">$1</li>')
            .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
            // Blockquotes
            .replace(/^>\s+(.*$)/gim, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-2">$1</blockquote>')
            // Horizontal rule
            .replace(/^---$/gim, '<hr class="my-4 border-border" />')
            // Line breaks
            .replace(/\n/g, '<br />');

        return html;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Cmd/Ctrl + S to save
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }
        // Cmd/Ctrl + P to toggle preview
        if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
            e.preventDefault();
            setIsPreview(!isPreview);
        }
        // Tab for indentation
        if (e.key === 'Tab' && textareaRef.current) {
            e.preventDefault();
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            setContent(content.substring(0, start) + '  ' + content.substring(end));
            setTimeout(() => {
                textareaRef.current?.setSelectionRange(start + 2, start + 2);
            }, 0);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={cn(
                    "fixed z-50 bg-background border border-border shadow-2xl overflow-hidden flex flex-col",
                    isFullscreen 
                        ? "inset-0 rounded-none" 
                        : "top-[5%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[90vh] rounded-2xl mx-4"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div 
                            className="w-1 h-8 rounded-full"
                            style={{ backgroundColor: spaceColor }}
                        />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título de la nota..."
                            className="flex-1 text-lg font-semibold bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {lastSaved && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Guardado
                            </span>
                        )}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="h-4 w-4" />
                            ) : (
                                <Maximize2 className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto">
                    {toolbarButtons.map((button, index) => {
                        if ('divider' in button) {
                            return <div key={index} className="w-px h-6 bg-border mx-1" />;
                        }
                        const Icon = button.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => handleToolbarAction(button)}
                                className="p-2 rounded-lg hover:bg-accent transition-colors"
                                title={button.label}
                                disabled={isPreview}
                            >
                                <Icon className={cn("h-4 w-4", isPreview && "opacity-50")} />
                            </button>
                        );
                    })}
                    
                    <div className="flex-1" />
                    
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setIsPreview(false)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
                                !isPreview ? "bg-accent" : "hover:bg-accent/50"
                            )}
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Editar
                        </button>
                        <button
                            onClick={() => setIsPreview(true)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
                                isPreview ? "bg-accent" : "hover:bg-accent/50"
                            )}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Vista previa
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden" onKeyDown={handleKeyDown}>
                    {isPreview ? (
                        <div 
                            className="h-full overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
                        />
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Escribe tu nota en Markdown..."
                            className="w-full h-full p-6 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground"
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{content.length} caracteres</span>
                        <span>{content.split(/\s+/).filter(Boolean).length} palabras</span>
                        <span>
                            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">⌘S</kbd> guardar
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">⌘P</kbd> preview
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !title.trim()}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Save className="h-4 w-4" />
                                    </motion.div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
