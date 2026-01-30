"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, 
    FolderKanban, 
    Mail, 
    CalendarDays, 
    Target, 
    Settings, 
    ChevronLeft, 
    ChevronRight, 
    Search, 
    Zap, 
    ChevronDown, 
    Plus, 
    Focus, 
    BarChart2, 
    LogOut, 
    X, 
    Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpaces } from "@/hooks/useSpaces";
import { useCaptures } from "@/hooks/useCaptures";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: number;
}

const mainNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Inicio", href: "/" },
    { icon: Layers, label: "Captura", href: "/capture" },
    { icon: Mail, label: "Inbox", href: "/inbox" },
    { icon: CalendarDays, label: "Calendario", href: "/calendar" },
    { icon: Target, label: "Objetivos", href: "/goals" },
    { icon: Focus, label: "Focus", href: "/focus" },
    { icon: BarChart2, label: "Progreso", href: "/stats" },
];

const bottomNavItems: NavItem[] = [
    { icon: Settings, label: "Ajustes", href: "/settings" },
];

const colorOptions = [
    { name: "Azul", value: "#3B82F6" },
    { name: "Verde", value: "#10B981" },
    { name: "Violeta", value: "#8B5CF6" },
    { name: "Amber", value: "#F59E0B" },
    { name: "Rosa", value: "#EC4899" },
    { name: "Cyan", value: "#06B6D4" },
    { name: "Rojo", value: "#EF4444" },
];

const iconOptions = ["📁", "💼", "🚀", "🎯", "💡", "🏠", "🎨", "📊", "🔧", "🌱", "🤖", "👤", "📱", "💰", "🎮", "📚"];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [spacesOpen, setSpacesOpen] = useState(true);
    const [showNewSpaceModal, setShowNewSpaceModal] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState("");
    const [newSpaceIcon, setNewSpaceIcon] = useState("📁");
    const [newSpaceColor, setNewSpaceColor] = useState("#3B82F6");
    const pathname = usePathname();
    
    const { spaces, loading: spacesLoading, createSpace } = useSpaces();
    const { unprocessedCount } = useCaptures();
    const { profile } = useProfile();
    const { signOut } = useAuth();

    const handleCreateSpace = async () => {
        if (!newSpaceName.trim()) return;
        await createSpace({
            name: newSpaceName,
            icon: newSpaceIcon,
            color: newSpaceColor,
        });
        setNewSpaceName("");
        setNewSpaceIcon("📁");
        setNewSpaceColor("#3B82F6");
        setShowNewSpaceModal(false);
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const navItemsWithBadge = mainNavItems.map(item => 
        item.href === "/capture" ? { ...item, badge: unprocessedCount || undefined } : item
    );

    return (
        <>
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="relative h-full bg-card border-r border-border flex flex-col"
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary flex-shrink-0">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -10 }} 
                                className="font-semibold text-lg tracking-tight"
                            >
                                Aidaptive
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search */}
                {!collapsed && (
                    <div className="px-3 py-3">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-lg border border-border hover:bg-accent transition-colors">
                            <Search className="h-4 w-4" />
                            <span>Buscar...</span>
                            <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
                        </button>
                    </div>
                )}

                {/* Main Navigation */}
                <nav className="px-3 py-2">
                    <ul className="space-y-1">
                        {navItemsWithBadge.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.label} className="relative">
                                    <Link 
                                        href={item.href} 
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                            "hover:bg-accent",
                                            isActive 
                                                ? "bg-primary/10 text-primary font-medium" 
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
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
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                        >
                            <FolderKanban className="h-4 w-4" strokeWidth={1.5} />
                            <span>Espacios</span>
                            <ChevronDown className={cn("h-3 w-3 ml-auto transition-transform", !spacesOpen && "-rotate-90")} />
                        </button>

                        <AnimatePresence>
                            {spacesOpen && (
                                <motion.ul 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: "auto" }} 
                                    exit={{ opacity: 0, height: 0 }} 
                                    className="space-y-1 mt-1"
                                >
                                    {spacesLoading ? (
                                        <li className="px-3 py-2 text-sm text-muted-foreground">Cargando...</li>
                                    ) : spaces.length === 0 ? (
                                        <li className="px-3 py-2 text-sm text-muted-foreground">Sin espacios</li>
                                    ) : (
                                        spaces.map((space) => {
                                            const isActive = pathname === `/spaces/${space.id}`;
                                            return (
                                                <li key={space.id}>
                                                    <Link 
                                                        href={`/spaces/${space.id}`} 
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                                            "hover:bg-accent",
                                                            isActive ? "bg-accent" : "text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <span className="text-base">{space.icon}</span>
                                                        <span className="flex-1 truncate text-sm">{space.name}</span>
                                                        <div 
                                                            className="w-2 h-2 rounded-full" 
                                                            style={{ backgroundColor: space.color || "#3B82F6" }} 
                                                        />
                                                    </Link>
                                                </li>
                                            );
                                        })
                                    )}
                                    
                                    <li>
                                        <button 
                                            onClick={() => setShowNewSpaceModal(true)} 
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                                        >
                                            <Plus className="h-4 w-4" strokeWidth={1.5} />
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
                                        "flex h-10 w-10 items-center justify-center rounded-lg transition-all mx-auto",
                                        "hover:bg-accent",
                                        pathname === `/spaces/${space.id}` && "bg-accent"
                                    )} 
                                    title={space.name}
                                >
                                    <span className="text-base">{space.icon}</span>
                                </Link>
                            ))}
                            <button 
                                onClick={() => setShowNewSpaceModal(true)} 
                                className="flex h-10 w-10 items-center justify-center rounded-lg transition-all mx-auto hover:bg-accent text-muted-foreground" 
                                title="Nuevo espacio"
                            >
                                <Plus className="h-4 w-4" strokeWidth={1.5} />
                            </button>
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
                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                            "hover:bg-accent",
                                            isActive 
                                                ? "bg-primary/10 text-primary font-medium" 
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                            {profile?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }} 
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-sm font-medium truncate">{profile?.name || "Usuario"}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!collapsed && (
                            <button 
                                onClick={handleSignOut} 
                                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" 
                                title="Cerrar sesión"
                            >
                                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button 
                    onClick={() => setCollapsed(!collapsed)} 
                    className="absolute -right-3 top-14 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors z-10"
                >
                    {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>
            </motion.aside>

            {/* New Space Modal */}
            <AnimatePresence>
                {showNewSpaceModal && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowNewSpaceModal(false)} 
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.95 }} 
                            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-md z-50 mx-4"
                        >
                            <div className="bg-card rounded-xl border border-border shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Nuevo espacio</h3>
                                    <button onClick={() => setShowNewSpaceModal(false)} className="p-1 rounded-lg hover:bg-accent">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Nombre</label>
                                        <input 
                                            type="text" 
                                            value={newSpaceName} 
                                            onChange={(e) => setNewSpaceName(e.target.value)} 
                                            placeholder="Ej: Mi proyecto" 
                                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                                            autoFocus 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Icono</label>
                                        <div className="flex flex-wrap gap-2">
                                            {iconOptions.map((icon) => (
                                                <button 
                                                    key={icon} 
                                                    onClick={() => setNewSpaceIcon(icon)} 
                                                    className={cn(
                                                        "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all",
                                                        newSpaceIcon === icon 
                                                            ? "border-primary bg-primary/10" 
                                                            : "border-border hover:border-muted-foreground"
                                                    )}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Color</label>
                                        <div className="flex gap-2">
                                            {colorOptions.map((color) => (
                                                <button 
                                                    key={color.value} 
                                                    onClick={() => setNewSpaceColor(color.value)} 
                                                    className={cn(
                                                        "w-8 h-8 rounded-full transition-all",
                                                        newSpaceColor === color.value 
                                                            ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" 
                                                            : "hover:scale-110"
                                                    )} 
                                                    style={{ backgroundColor: color.value }} 
                                                    title={color.name} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    <button 
                                        onClick={() => setShowNewSpaceModal(false)} 
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleCreateSpace} 
                                        disabled={!newSpaceName.trim()} 
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Crear espacio
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
