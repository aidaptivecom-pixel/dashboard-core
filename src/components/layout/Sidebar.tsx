"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Folder,
    Inbox,
    Calendar,
    Target,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    Sparkles,
    Building2,
    Rocket,
    User,
    ChevronDown,
    Plus,
    Brain,
    BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: number;
}

interface Space {
    id: string;
    name: string;
    icon: string;
    type: "business" | "project" | "personal";
    color: string;
}

const mainNavItems: NavItem[] = [
    { icon: Home, label: "Inicio", href: "/" },
    { icon: Inbox, label: "Captura", href: "/capture", badge: 3 },
    { icon: Calendar, label: "Calendario", href: "/calendar" },
    { icon: Target, label: "Objetivos", href: "/goals" },
    { icon: Brain, label: "Focus", href: "/focus" },
    { icon: BarChart3, label: "Progreso", href: "/stats" },
];

const bottomNavItems: NavItem[] = [
    { icon: Settings, label: "Ajustes", href: "/settings" },
];

const spaces: Space[] = [
    { id: "aidaptive", name: "Aidaptive", icon: "🤖", type: "business", color: "#4F6BFF" },
    { id: "igreen", name: "iGreen", icon: "🌱", type: "business", color: "#10B981" },
    { id: "limbo", name: "Limbo", icon: "🚀", type: "project", color: "#8B5CF6" },
    { id: "personal", name: "Personal", icon: "👤", type: "personal", color: "#F59E0B" },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [spacesOpen, setSpacesOpen] = useState(true);
    const pathname = usePathname();

    const getTypeIcon = (type: string) => {
        if (type === "business") return Building2;
        if (type === "project") return Rocket;
        return User;
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative h-full bg-background flex flex-col"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-semibold text-lg"
                        >
                            FocusFlow
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Search */}
            {!collapsed && (
                <div className="px-3 py-3">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-xl border border-border hover:bg-accent transition-colors">
                        <Search className="h-4 w-4" />
                        <span>Buscar...</span>
                        <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
                    </button>
                </div>
            )}

            {/* Main Navigation */}
            <nav className="px-3 py-2">
                <ul className="space-y-1">
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.label} className="relative">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                        "hover:bg-accent",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex-1"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {!collapsed && item.badge && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-medium px-1.5">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Spaces Section */}
            {!collapsed && (
                <div className="flex-1 px-3 py-2 overflow-y-auto">
                    <button
                        onClick={() => setSpacesOpen(!spacesOpen)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                        <Folder className="h-4 w-4" />
                        <span>Espacios</span>
                        <ChevronDown className={cn(
                            "h-3 w-3 ml-auto transition-transform",
                            !spacesOpen && "-rotate-90"
                        )} />
                    </button>

                    <AnimatePresence>
                        {spacesOpen && (
                            <motion.ul
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-1 mt-1"
                            >
                                {spaces.map((space) => {
                                    const isActive = pathname === `/spaces/${space.id}`;
                                    const TypeIcon = getTypeIcon(space.type);
                                    
                                    return (
                                        <li key={space.id}>
                                            <Link
                                                href={`/spaces/${space.id}`}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                                                    "hover:bg-accent",
                                                    isActive
                                                        ? "bg-accent"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <span className="text-lg">{space.icon}</span>
                                                <span className="flex-1 truncate text-sm">{space.name}</span>
                                                <TypeIcon className="h-3 w-3 opacity-50" />
                                            </Link>
                                        </li>
                                    );
                                })}
                                
                                {/* Add Space Button */}
                                <li>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                                        <Plus className="h-4 w-4" />
                                        <span className="text-sm">Nuevo espacio</span>
                                    </button>
                                </li>
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Collapsed Spaces */}
            {collapsed && (
                <div className="flex-1 px-3 py-2 overflow-y-auto">
                    <div className="space-y-2">
                        {spaces.map((space) => (
                            <Link
                                key={space.id}
                                href={`/spaces/${space.id}`}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all mx-auto",
                                    "hover:bg-accent",
                                    pathname === `/spaces/${space.id}` && "bg-accent"
                                )}
                                title={space.name}
                            >
                                <span className="text-lg">{space.icon}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="px-3 py-2 border-t border-border">
                <ul className="space-y-1">
                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                                        "hover:bg-accent",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* User */}
            <div className="px-3 py-3 border-t border-border">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-coral to-purple flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                        A
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-medium truncate">Alex</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-14 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-accent transition-colors z-10"
            >
                {collapsed ? (
                    <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                    <ChevronLeft className="h-3.5 w-3.5" />
                )}
            </button>
        </motion.aside>
    );
}
