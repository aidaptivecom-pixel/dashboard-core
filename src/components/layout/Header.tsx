"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Search,
    Command,
    Plus,
    X,
    Home,
    Inbox,
    Calendar,
    Target,
    Settings,
    FolderOpen,
    FileText,
    ChevronRight,
    Mic,
    Image,
    Sparkles,
    Brain,
    BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Space data for breadcrumbs
const spaceData: Record<string, { name: string; icon: string }> = {
    aidaptive: { name: "Aidaptive", icon: "🤖" },
    igreen: { name: "iGreen", icon: "🌱" },
    limbo: { name: "Limbo", icon: "🚀" },
    personal: { name: "Personal", icon: "👤" },
};

// Search results mock
const searchResults = [
    { id: "1", type: "file", title: "CRM - Contexto para Claude", space: "Aidaptive", icon: "🤖" },
    { id: "2", type: "file", title: "Inventario actualizado", space: "iGreen", icon: "🌱" },
    { id: "3", type: "task", title: "Revisar propuesta cliente ABC", space: "Aidaptive", icon: "🤖" },
    { id: "4", type: "goal", title: "Lanzar Limbo MVP", space: "Limbo", icon: "🚀" },
    { id: "5", type: "capture", title: "Idea: Integración con Notion", space: "Captura", icon: "📥" },
];

const quickActions = [
    { id: "capture", label: "Nueva captura", icon: Plus, shortcut: "C", href: "/capture" },
    { id: "focus", label: "Iniciar focus", icon: Brain, shortcut: "F", href: "/focus" },
    { id: "task", label: "Nueva tarea", icon: Target, shortcut: "T" },
    { id: "note", label: "Nueva nota", icon: FileText, shortcut: "N" },
];

interface HeaderProps {
    className?: string;
}

export function Header({ className }: HeaderProps) {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [quickCaptureText, setQuickCaptureText] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const captureInputRef = useRef<HTMLInputElement>(null);

    // Generate breadcrumbs from pathname
    const getBreadcrumbs = () => {
        const segments = pathname.split("/").filter(Boolean);
        const breadcrumbs: { label: string; href: string; icon?: React.ReactNode }[] = [];

        if (segments.length === 0) {
            return [{ label: "Inicio", href: "/", icon: <Home className="h-4 w-4" /> }];
        }

        // Add home
        breadcrumbs.push({ label: "Inicio", href: "/", icon: <Home className="h-4 w-4" /> });

        segments.forEach((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            
            if (segment === "capture") {
                breadcrumbs.push({ label: "Captura", href, icon: <Inbox className="h-4 w-4" /> });
            } else if (segment === "calendar") {
                breadcrumbs.push({ label: "Calendario", href, icon: <Calendar className="h-4 w-4" /> });
            } else if (segment === "goals") {
                breadcrumbs.push({ label: "Objetivos", href, icon: <Target className="h-4 w-4" /> });
            } else if (segment === "focus") {
                breadcrumbs.push({ label: "Focus", href, icon: <Brain className="h-4 w-4" /> });
            } else if (segment === "stats") {
                breadcrumbs.push({ label: "Progreso", href, icon: <BarChart3 className="h-4 w-4" /> });
            } else if (segment === "settings") {
                breadcrumbs.push({ label: "Ajustes", href, icon: <Settings className="h-4 w-4" /> });
            } else if (segment === "spaces") {
                breadcrumbs.push({ label: "Espacios", href: "/", icon: <FolderOpen className="h-4 w-4" /> });
            } else if (spaceData[segment]) {
                const space = spaceData[segment];
                breadcrumbs.push({ 
                    label: space.name, 
                    href,
                    icon: <span className="text-sm">{space.icon}</span>
                });
            }
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            // Escape to close
            if (e.key === "Escape") {
                setIsSearchOpen(false);
                setIsQuickCaptureOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Focus capture input when opened
    useEffect(() => {
        if (isQuickCaptureOpen && captureInputRef.current) {
            captureInputRef.current.focus();
        }
    }, [isQuickCaptureOpen]);

    const filteredResults = searchQuery
        ? searchResults.filter(r => 
            r.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    const handleQuickCapture = () => {
        if (quickCaptureText.trim()) {
            // TODO: Save to capture
            console.log("Quick capture:", quickCaptureText);
            setQuickCaptureText("");
            setIsQuickCaptureOpen(false);
        }
    };

    return (
        <>
            <header className={cn("flex items-center justify-between py-4 px-6 border-b border-border bg-background", className)}>
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.href} className="flex items-center gap-1">
                            {index > 0 && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Link
                                href={crumb.href}
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors",
                                    index === breadcrumbs.length - 1
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                {crumb.icon}
                                <span>{crumb.label}</span>
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Search button */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/50 hover:bg-accent transition-colors text-sm text-muted-foreground"
                    >
                        <Search className="h-4 w-4" />
                        <span className="hidden md:inline">Buscar...</span>
                        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-xs">
                            <Command className="h-3 w-3" />
                            <span>K</span>
                        </kbd>
                    </button>

                    {/* Quick capture button */}
                    <button
                        onClick={() => setIsQuickCaptureOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden md:inline">Captura</span>
                    </button>
                </div>
            </header>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
                        >
                            <div className="mx-4 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
                                {/* Search input */}
                                <div className="flex items-center gap-3 p-4 border-b border-border">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Buscar archivos, tareas, objetivos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                                    />
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="p-1 rounded-lg hover:bg-accent"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Results or quick actions */}
                                <div className="max-h-80 overflow-y-auto">
                                    {searchQuery ? (
                                        filteredResults.length > 0 ? (
                                            <div className="p-2">
                                                {filteredResults.map((result) => (
                                                    <button
                                                        key={result.id}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-left"
                                                        onClick={() => setIsSearchOpen(false)}
                                                    >
                                                        <span className="text-lg">{result.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">{result.title}</p>
                                                            <p className="text-xs text-muted-foreground">{result.space}</p>
                                                        </div>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                                            {result.type === "file" && "Archivo"}
                                                            {result.type === "task" && "Tarea"}
                                                            {result.type === "goal" && "Objetivo"}
                                                            {result.type === "capture" && "Captura"}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-muted-foreground">
                                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>No se encontraron resultados</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="p-2">
                                            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                                                Acciones rápidas
                                            </p>
                                            {quickActions.map((action) => (
                                                <Link
                                                    key={action.id}
                                                    href={action.href || "#"}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
                                                    onClick={() => setIsSearchOpen(false)}
                                                >
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <action.icon className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="flex-1">{action.label}</span>
                                                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs">
                                                        {action.shortcut}
                                                    </kbd>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↑↓</kbd>
                                            navegar
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↵</kbd>
                                            seleccionar
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">esc</kbd>
                                        cerrar
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Quick Capture Modal */}
            <AnimatePresence>
                {isQuickCaptureOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsQuickCaptureOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
                        >
                            <div className="mx-4 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
                                <div className="p-4 border-b border-border">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            Captura rápida
                                        </h3>
                                        <button
                                            onClick={() => setIsQuickCaptureOpen(false)}
                                            className="p-1 rounded-lg hover:bg-accent"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <textarea
                                        ref={captureInputRef as any}
                                        placeholder="¿Qué tenés en mente?"
                                        value={quickCaptureText}
                                        onChange={(e) => setQuickCaptureText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                                handleQuickCapture();
                                            }
                                        }}
                                        className="w-full h-24 bg-transparent outline-none resize-none placeholder:text-muted-foreground"
                                    />
                                </div>

                                <div className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                                            <Mic className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                                            <Image className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">⌘↵</kbd> guardar
                                        </span>
                                        <button
                                            onClick={handleQuickCapture}
                                            disabled={!quickCaptureText.trim()}
                                            className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
