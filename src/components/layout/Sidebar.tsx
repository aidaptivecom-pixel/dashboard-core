"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    FolderKanban,
    Inbox,
    Image,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Search,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceSelector } from "@/components/workspace/WorkspaceSelector";

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: number;
}

const navItems: NavItem[] = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Inbox, label: "Inbox", href: "/inbox", badge: 5 },
    { icon: FolderKanban, label: "Projects", href: "/projects" },
    { icon: Image, label: "Capture", href: "/capture" },
    { icon: BarChart3, label: "Insights", href: "/insights" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

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

            {/* Workspace Selector */}
            {!collapsed && (
                <div className="px-2 py-2 border-b border-border">
                    <WorkspaceSelector />
                </div>
            )}

            {/* Collapsed Workspace Icon */}
            {collapsed && (
                <div className="px-3 py-3 border-b border-border flex justify-center">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                        🤖
                    </div>
                </div>
            )}

            {/* Search */}
            {!collapsed && (
                <div className="px-3 py-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-lg border border-border hover:bg-accent transition-colors">
                        <Search className="h-4 w-4" />
                        <span>Buscar...</span>
                        <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.label} className="relative">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
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
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="flex-1 truncate"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {!collapsed && item.badge && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral text-white text-xs font-medium px-1.5">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                                {collapsed && item.badge && (
                                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral text-white text-[10px] font-medium px-1">
                                        {item.badge}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Help & Support */}
            <div className="px-3 py-2 border-t border-border">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <HelpCircle className="h-5 w-5 flex-shrink-0" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                Ayuda
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* User Avatar */}
            <div className="px-3 py-3 border-t border-border">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-coral to-purple flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                        A
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-medium truncate">Alex</p>
                                <p className="text-xs text-muted-foreground truncate">alex@example.com</p>
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
