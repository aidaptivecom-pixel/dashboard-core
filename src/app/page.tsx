"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
    Clock, 
    CheckCircle2, 
    Circle, 
    Target, 
    Zap,
    Inbox,
    FolderKanban,
    Calendar,
    AlertCircle,
    ChevronRight
} from "lucide-react";
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

    const today = new Date().toISOString().split("T")[0];
    // Only tasks with today's date (not all undated tasks)
    const todayTasks = tasks.filter(t => t.due_date === today);
    const pendingTasks = todayTasks.filter(t => !t.completed);
    const completedToday = todayTasks.filter(t => t.completed).length;
    
    const userName = profile?.name?.split(" ")[0] || "Usuario";
    const recentSpaces = spaces.slice(0, 6);

    // Limit to 4 tasks max
    const MAX_TASKS = 4;
    const tasksToShow = pendingTasks.slice(0, MAX_TASKS);
    const remainingTasks = pendingTasks.length - MAX_TASKS;

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="mb-5" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Clock className="h-4 w-4" />
                        <span>{currentTime}</span>
                        <span>·</span>
                        <span>{new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</span>
                    </div>
                    <h1 className="text-2xl font-bold">
                        {greeting}, <span className="text-primary">{userName}</span>
                    </h1>
                </motion.div>

                {/* Stats Bar - More compact */}
                <motion.div 
                    className="flex flex-wrap items-center gap-6 mb-5 p-3 rounded-xl bg-card border border-border"
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">{completedToday}/{todayTasks.length}</span>
                        <span className="text-sm text-muted-foreground">tareas</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-violet-500" />
                        <span className="text-lg font-semibold">{activeGoals.length}</span>
                        <span className="text-sm text-muted-foreground">metas</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-amber-500" />
                        <span className="text-lg font-semibold">{spaces.length}</span>
                        <span className="text-sm text-muted-foreground">espacios</span>
                    </div>
                    
                    {unprocessedCount > 0 && (
                        <Link href="/capture" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Inbox className="h-5 w-5 text-rose-500" />
                            <span className="text-lg font-semibold">{unprocessedCount}</span>
                            <span className="text-sm text-muted-foreground">inbox</span>
                        </Link>
                    )}
                </motion.div>

                {/* Main Grid - 3 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Column 1: Tasks */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="rounded-xl border border-border bg-card h-fit">
                            <div className="flex items-center justify-between p-3 border-b border-border">
                                <h2 className="font-semibold flex items-center gap-2 text-sm">
                                    <Zap className="h-4 w-4 text-amber-500" />
                                    Foco de hoy
                                </h2>
                                <Link href="/goals" className="text-xs text-primary hover:underline">
                                    Ver todas
                                </Link>
                            </div>
                            
                            <div className="p-2">
                                {pendingTasks.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">¡Todo listo!</p>
                                    </div>
                                ) : (
                                    <>
                                        {tasksToShow.map((task) => {
                                            const space = spaces.find(s => s.id === task.space_id);
                                            return (
                                                <button
                                                    key={task.id}
                                                    onClick={() => handleToggleTask(task.id)}
                                                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-all text-left group"
                                                >
                                                    <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                                    <span className="text-sm truncate flex-1">{task.title}</span>
                                                    {task.priority === 'high' && (
                                                        <AlertCircle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                        
                                        {remainingTasks > 0 && (
                                            <Link 
                                                href="/goals"
                                                className="flex items-center justify-center gap-1 p-2 text-xs text-muted-foreground hover:text-primary"
                                            >
                                                +{remainingTasks} más <ChevronRight className="h-3 w-3" />
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Column 2: Spaces */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold flex items-center gap-2 text-sm">
                                <FolderKanban className="h-4 w-4" />
                                Espacios
                            </h2>
                            <Link href="/spaces" className="text-xs text-primary hover:underline">
                                Ver todos
                            </Link>
                        </div>
                        
                        <div className="space-y-2">
                            {recentSpaces.map((space, index) => (
                                <motion.div
                                    key={space.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.03 }}
                                >
                                    <Link
                                        href={`/spaces/${space.id}`}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
                                    >
                                        <div 
                                            className="h-9 w-9 rounded-lg flex items-center justify-center text-lg"
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
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Column 3: Goals + Quick Actions */}
                    <motion.div 
                        className="space-y-5"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Goals */}
                        <div className="rounded-xl border border-border bg-card">
                            <div className="flex items-center justify-between p-3 border-b border-border">
                                <h2 className="font-semibold flex items-center gap-2 text-sm">
                                    <Target className="h-4 w-4 text-violet-500" />
                                    Metas
                                </h2>
                                <Link href="/goals" className="text-xs text-primary hover:underline">
                                    Ver todas
                                </Link>
                            </div>
                            
                            <div className="p-3 space-y-2">
                                {activeGoals.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        <p className="text-sm">No hay metas activas</p>
                                    </div>
                                ) : (
                                    activeGoals.slice(0, 3).map((goal) => {
                                        const space = spaces.find(s => s.id === goal.space_id);
                                        const progress = goal.progress || 0;
                                        return (
                                            <Link 
                                                key={goal.id}
                                                href="/goals"
                                                className="block p-2 rounded-lg hover:bg-accent transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                        <span className="text-sm">{space?.icon || "🎯"}</span>
                                                        <p className="text-sm truncate">{goal.title}</p>
                                                    </div>
                                                    <span className="text-xs font-medium" style={{ color: goal.color || "#8B5CF6" }}>
                                                        {progress}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{ 
                                                            backgroundColor: goal.color || "#8B5CF6",
                                                            width: `${progress}%`
                                                        }}
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/capture"
                                className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-all text-sm"
                            >
                                <Inbox className="h-4 w-4 text-primary" />
                                Capturar
                            </Link>
                            <Link
                                href="/calendar"
                                className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-all text-sm"
                            >
                                <Calendar className="h-4 w-4 text-primary" />
                                Calendario
                            </Link>
                            <Link
                                href="/focus"
                                className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-all text-sm"
                            >
                                <Zap className="h-4 w-4 text-amber-500" />
                                Focus
                            </Link>
                            <Link
                                href="/goals"
                                className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-all text-sm"
                            >
                                <Target className="h-4 w-4 text-violet-500" />
                                Metas
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
