"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
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
    ChevronRight,
    Upload,
    FolderPlus,
    Star,
    Clock,
    ArrowUpDown,
    StickyNote,
    FileCode,
    Presentation,
    Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SpaceItem {
    id: string;
    name: string;
    type: "folder" | "note" | "document" | "image" | "code" | "presentation";
    updatedAt: string;
    starred?: boolean;
    size?: string;
}

interface SpaceData {
    id: string;
    name: string;
    icon: string;
    type: "business" | "project" | "personal";
    color: string;
    description: string;
    items: SpaceItem[];
}

const spacesData: Record<string, SpaceData> = {
    aidaptive: {
        id: "aidaptive",
        name: "Aidaptive",
        icon: "🤖",
        type: "business",
        color: "#4F6BFF",
        description: "Automatización e IA para empresas",
        items: [
            { id: "1", name: "Clientes", type: "folder", updatedAt: "Hace 2h" },
            { id: "2", name: "Propuestas", type: "folder", updatedAt: "Hace 1d" },
            { id: "3", name: "Proyectos Activos", type: "folder", updatedAt: "Hace 3h" },
            { id: "4", name: "CRM - Contexto para Claude", type: "note", updatedAt: "Hace 30min", starred: true },
            { id: "5", name: "Roadmap 2026", type: "document", updatedAt: "Hace 2d" },
            { id: "6", name: "Presentación Servicios", type: "presentation", updatedAt: "Hace 1w" },
            { id: "7", name: "Scripts Automatización", type: "code", updatedAt: "Hace 4h" },
            { id: "8", name: "Logo y Assets", type: "folder", updatedAt: "Hace 2w" },
        ],
    },
    igreen: {
        id: "igreen",
        name: "iGreen",
        icon: "🌱",
        type: "business",
        color: "#10B981",
        description: "Proyecto sustentable",
        items: [
            { id: "1", name: "Proveedores", type: "folder", updatedAt: "Hace 1d" },
            { id: "2", name: "Inventario", type: "document", updatedAt: "Hace 2h" },
            { id: "3", name: "Fotos Productos", type: "folder", updatedAt: "Hace 3d" },
            { id: "4", name: "Precios y Costos", type: "document", updatedAt: "Hace 1w" },
        ],
    },
    limbo: {
        id: "limbo",
        name: "Limbo",
        icon: "🚀",
        type: "project",
        color: "#8B5CF6",
        description: "Landing page en construcción",
        items: [
            { id: "1", name: "Diseño UI", type: "folder", updatedAt: "Hace 1h" },
            { id: "2", name: "Copy y Textos", type: "note", updatedAt: "Hace 4h" },
            { id: "3", name: "Wireframes", type: "image", updatedAt: "Hace 2d" },
            { id: "4", name: "Componentes React", type: "code", updatedAt: "Hace 1d" },
        ],
    },
    personal: {
        id: "personal",
        name: "Personal",
        icon: "👤",
        type: "personal",
        color: "#F59E0B",
        description: "Notas y archivos personales",
        items: [
            { id: "1", name: "Ideas", type: "folder", updatedAt: "Hace 2h" },
            { id: "2", name: "Lecturas", type: "folder", updatedAt: "Hace 1w" },
            { id: "3", name: "Reflexiones", type: "note", updatedAt: "Hace 3d" },
        ],
    },
};

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

export default function SpacePage() {
    const params = useParams();
    const spaceId = params.id as string;
    const space = spacesData[spaceId];

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("date");

    if (!space) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Espacio no encontrado</p>
                </div>
            </MainLayout>
        );
    }

    const filteredItems = space.items
        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0; // Keep original order for date (already sorted)
        });

    const folders = filteredItems.filter(i => i.type === "folder");
    const files = filteredItems.filter(i => i.type !== "folder");

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div 
                            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                            style={{ backgroundColor: `${space.color}15` }}
                        >
                            {space.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{space.name}</h1>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    space.type === "business" && "bg-blue-500/10 text-blue-500",
                                    space.type === "project" && "bg-purple/10 text-purple",
                                    space.type === "personal" && "bg-yellow-500/10 text-yellow-600"
                                )}>
                                    {space.type === "business" ? "Negocio" : space.type === "project" ? "Proyecto" : "Personal"}
                                </span>
                            </div>
                            <p className="text-muted-foreground">{space.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="btn-primary flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo
                        </button>
                        <button className="p-2 rounded-xl border border-border hover:bg-accent transition-colors">
                            <Bot className="h-5 w-5" />
                        </button>
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
                                className={cn(
                                    "p-2 transition-colors",
                                    viewMode === "grid" ? "bg-accent" : "hover:bg-accent"
                                )}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "p-2 transition-colors",
                                    viewMode === "list" ? "bg-accent" : "hover:bg-accent"
                                )}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:bg-accent transition-colors text-sm whitespace-nowrap">
                        <FolderPlus className="h-4 w-4" />
                        Nueva carpeta
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:bg-accent transition-colors text-sm whitespace-nowrap">
                        <StickyNote className="h-4 w-4" />
                        Nueva nota
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:bg-accent transition-colors text-sm whitespace-nowrap">
                        <Upload className="h-4 w-4" />
                        Subir archivo
                    </button>
                </div>

                {/* Content */}
                {viewMode === "grid" ? (
                    <div className="space-y-6">
                        {/* Folders */}
                        {folders.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Carpetas</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {folders.map((item) => {
                                        const Icon = getFileIcon(item.type);
                                        const colorClass = getFileColor(item.type);
                                        
                                        return (
                                            <motion.button
                                                key={item.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group p-4 rounded-2xl border border-border bg-background hover:bg-accent hover:border-primary/20 transition-all text-left"
                                            >
                                                <div className={cn("p-3 rounded-xl w-fit mb-3", colorClass)}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <p className="font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.updatedAt}</p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Files */}
                        {files.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Archivos</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {files.map((item) => {
                                        const Icon = getFileIcon(item.type);
                                        const colorClass = getFileColor(item.type);
                                        
                                        return (
                                            <motion.button
                                                key={item.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group p-4 rounded-2xl border border-border bg-background hover:bg-accent hover:border-primary/20 transition-all text-left relative"
                                            >
                                                {item.starred && (
                                                    <Star className="absolute top-2 right-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                )}
                                                <div className={cn("p-3 rounded-xl w-fit mb-3", colorClass)}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <p className="font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.updatedAt}</p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* List View */
                    <div className="border border-border rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-[1fr,auto,auto] gap-4 px-4 py-2 bg-muted/50 text-sm font-medium text-muted-foreground">
                            <span>Nombre</span>
                            <span className="w-24">Modificado</span>
                            <span className="w-8"></span>
                        </div>
                        {filteredItems.map((item, index) => {
                            const Icon = getFileIcon(item.type);
                            const colorClass = getFileColor(item.type);
                            
                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="w-full grid grid-cols-[1fr,auto,auto] gap-4 px-4 py-3 hover:bg-accent transition-colors text-left items-center border-t border-border"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn("p-2 rounded-lg", colorClass)}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span className="truncate">{item.name}</span>
                                        {item.starred && (
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <span className="text-sm text-muted-foreground w-24">{item.updatedAt}</span>
                                    <button className="p-1 rounded hover:bg-muted w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </motion.button>
                            );
                        })}
                    </div>
                )}

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">
                            {searchQuery ? "No se encontraron resultados" : "Este espacio está vacío"}
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
