"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    Clock, 
    CheckCircle2, 
    Circle, 
    Plus, 
    Target, 
    Zap,
    Inbox,
    FolderKanban,
    ArrowRight,
    Calendar,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useSpaces } from "@/hooks/useSpaces";
import { useCaptures } from "@/hooks/useCaptures";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");
    
    const { profile } = useProfile();
    const { spaces } = useSpaces();
    const { unprocessedCount } = useCaptures();
    const { activeGoals } = useGoals();
    const { tasks, toggleTask } = useTasks();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }));
            const hour = now.getHours();
            if (hour < 12) setGreeting("Buenos días");
            else if (hour < 18) setGreeting("Buenas tardes");
            else setGreeting("Buenas noches");
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleTask = async (id: string) => {
        await toggleTask(id);
    };

    // Today's date
    const today = new Date().toISOString().split("T")[0];
    
    // Filter tasks for today
    const todayTasks = tasks.filter(t => !t.due_date || t.due_date === today);
    const pendingTasks = todayTasks.filter(t => !t.completed);
    const completedToday = todayTasks.filter(t => t.completed).length;
    
    // Goals progress
    const goalsProgress = activeGoals.length > 0 
        ? Math.round(activeGoals.reduce((acc, g) => acc + (g.progress || 0), 0) / activeGoals.length)
        : 0;

    const userName = profile?.name?.split(" ")[0] || "Usuario";

    // Get top priority spaces (those with recent activity or active projects)
    const recentSpaces = spaces.slice(0, 6);

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="mb-6" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Clock className="h-4 w-4" />
                        <span>{currentTime}</span>
                        <span>·</span>
                        <span>{new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</span>
                    </div>
                    <h1 className="text-3xl font-bold">
                        {greeting}, <span className="text-primary">{userName}</span>
                    </h1>
                </motion.div>

                {/* Stats Bar */}
                <motion.div 
                    className="flex flex-wrap gap-4 mb-8 p-4 rounded-xl bg-card border border-border"
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{completedToday}<span className="text-muted-foreground text-lg">/{todayTasks.length}</span></p>
                            <p className="text-xs text-muted-foreground">Tareas hoy</p>
                        </div>
                    </div>
                    
                    <div className="w-px bg-border" />
                    
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{activeGoals.length}</p>
                            <p className="text-xs text-muted-foreground">Metas activas</p>
                        </div>
                    </div>
                    
                    <div className="w-px bg-border" />
                    
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <FolderKanban className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{spaces.length}</p>
                            <p className="text-xs text-muted-foreground">Espacios</p>
                        </div>
                    </div>
                    
                    {unprocessedCount > 0 && (
                        <>
                            <div className="w-px bg-border" />
                            <Link href="/capture" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center relative">
                                    <Inbox className="h-5 w-5 text-rose-500" />
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-medium">
                                        {unprocessedCount}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{unprocessedCount}</p>
                                    <p className="text-xs text-muted-foreground">En inbox</p>
                                </div>
                            </Link>
                        </>
                    )}
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* Left Column - Focus Today */}
                    <motion.div 
                        className="lg:col-span-3 space-y-6"
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Today's Tasks */}
                        <div className="rounded-xl border border-border bg-card">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-500" />
                                    Foco de hoy
                                </h2>
                                <Link 
                                    href="/goals" 
                                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar
                                </Link>
                            </div>
                            
                            <div className="p-2">
                                {pendingTasks.length === 0 && completedToday === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Circle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No hay tareas para hoy</p>
                                        <p className="text-sm">Agrega tareas para mantener el foco</p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {/* Pending tasks first */}
                                        {pendingTasks.map((task) => {
                                            const space = spaces.find(s => s.id === task.space_id);
                                            return (
                                                <motion.button
                                                    key={task.id}
                                                    layout
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: 50 }}
                                                    onClick={() => handleToggleTask(task.id)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all text-left group"
                                                >
                                                    <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{task.title}</p>
                                                        {space && (
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <span>{space.icon}</span>
                                                                {space.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {task.priority === 'high' && (
                                                        <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                        
                                        {/* Completed tasks */}
                                        {todayTasks.filter(t => t.completed).slice(0, 3).map((task) => {
                                            const space = spaces.find(s => s.id === task.space_id);
                                            return (
                                                <motion.button
                                                    key={task.id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    onClick={() => handleToggleTask(task.id)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all text-left opacity-50"
                                                >
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm line-through text-muted-foreground truncate">{task.title}</p>
                                                        {space && (
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <span>{space.icon}</span>
                                                                {space.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>

                        {/* Spaces Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <FolderKanban className="h-5 w-5" />
                                    Espacios
                                </h2>
                                <Link href="/spaces" className="text-sm text-primary hover:underline">
                                    Ver todos
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {recentSpaces.map((space, index) => (
                                    <motion.div
                                        key={space.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                    >
                                        <Link
                                            href={`/spaces/${space.id}`}
                                            className="block p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                                                    style={{ backgroundColor: `${space.color}15` }}
                                                >
                                                    {space.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                                        {space.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {space.description || "Sin descripción"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Goals & Calendar */}
                    <motion.div 
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Active Goals */}
                        <div className="rounded-xl border border-border bg-card">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Target className="h-5 w-5 text-violet-500" />
                                    Metas activas
                                </h2>
                                <Link href="/goals" className="text-sm text-primary hover:underline">
                                    Ver todas
                                </Link>
                            </div>
                            
                            <div className="p-4 space-y-4">
                                {activeGoals.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Target className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No hay metas activas</p>
                                        <Link href="/goals" className="text-primary text-sm hover:underline">
                                            Crear una meta
                                        </Link>
                                    </div>
                                ) : (
                                    activeGoals.slice(0, 4).map((goal, index) => {
                                        const space = spaces.find(s => s.id === goal.space_id);
                                        const progress = goal.progress || 0;
                                        return (
                                            <motion.div
                                                key={goal.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + index * 0.05 }}
                                            >
                                                <Link 
                                                    href="/goals"
                                                    className="block p-3 rounded-lg border border-border hover:border-primary/20 transition-all"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            <span className="text-lg">{space?.icon || "🎯"}</span>
                                                            <p className="font-medium text-sm truncate">{goal.title}</p>
                                                        </div>
                                                        <span className="text-sm font-semibold ml-2" style={{ color: goal.color || "#8B5CF6" }}>
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: goal.color || "#8B5CF6" }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                                                        />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl border border-border bg-card p-4">
                            <h3 className="font-semibold mb-3 text-sm">Acciones rápidas</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/capture"
                                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-all text-sm"
                                >
                                    <Inbox className="h-4 w-4 text-primary" />
                                    Capturar idea
                                </Link>
                                <Link
                                    href="/calendar"
                                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-all text-sm"
                                >
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Ver calendario
                                </Link>
                                <Link
                                    href="/focus"
                                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-all text-sm"
                                >
                                    <Zap className="h-4 w-4 text-amber-500" />
                                    Modo focus
                                </Link>
                                <Link
                                    href="/goals"
                                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-all text-sm"
                                >
                                    <Target className="h-4 w-4 text-violet-500" />
                                    Nueva meta
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
