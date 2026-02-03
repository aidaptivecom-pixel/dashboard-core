"use client";

import { useState } from "react";
import { FocusMode } from "@/components/focus/FocusMode";
import { motion } from "framer-motion";
import {
    Brain,
    Play,
    Clock,
    Target,
    CheckCircle2,
    Circle,
    Zap,
    TrendingUp,
    Calendar,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { useSpaces } from "@/hooks/useSpaces";
import { useFocusSessions } from "@/hooks/useFocusSessions";

interface TaskWithSpace {
    id: string;
    title: string;
    space: string;
    spaceIcon: string;
    spaceId: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
}

export default function FocusPage() {
    const { tasks, loading: tasksLoading, updateTask } = useTasks();
    const { spaces, loading: spacesLoading } = useSpaces();
    const { todayFocusMinutes, todayCompletedSessions, sessions } = useFocusSessions();
    
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskWithSpace | null>(null);

    const loading = tasksLoading || spacesLoading;

    // Map tasks with space info
    const tasksWithSpaces: TaskWithSpace[] = tasks.map(task => {
        const space = spaces.find(s => s.id === task.space_id);
        return {
            id: task.id,
            title: task.title,
            space: space?.name || 'Sin espacio',
            spaceIcon: space?.icon || '📋',
            spaceId: task.space_id || '',
            completed: task.completed || false,
            priority: (task.priority as 'high' | 'medium' | 'low') || 'medium',
        };
    });

    const startFocus = (task?: TaskWithSpace) => {
        setSelectedTask(task || null);
        setIsFocusModeOpen(true);
    };

    const handleTaskComplete = async (taskId: string) => {
        await updateTask(taskId, { completed: true });
    };

    const toggleTask = async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            await updateTask(taskId, { completed: !task.completed });
        }
    };

    const pendingTasks = tasksWithSpaces.filter(t => !t.completed);
    const highPriorityTasks = pendingTasks.filter(t => t.priority === "high");

    // Calculate streak (consecutive days with completed sessions)
    const calculateStreak = () => {
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);
        
        while (true) {
            const dateStr = currentDate.toDateString();
            const hasSession = sessions.some(s => 
                new Date(s.started_at).toDateString() === dateStr && 
                s.type === 'focus' && 
                s.completed
            );
            
            if (hasSession) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (currentDate.toDateString() === today.toDateString()) {
                // Today might not have sessions yet, check yesterday
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    };

    const todayStats = {
        focusTime: (todayFocusMinutes / 60).toFixed(1),
        completedTasks: tasksWithSpaces.filter(t => t.completed).length,
        pomodoros: todayCompletedSessions,
        streak: calculateStreak(),
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold flex items-center gap-3 mb-2">
                        <Brain className="h-7 w-7" />
                        Modo Focus
                    </h1>
                    <p className="text-muted-foreground">
                        Concentrate en una tarea a la vez con el timer Pomodoro
                    </p>
                </motion.div>

                {/* Quick start */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => startFocus()}
                        className="w-full p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg shadow-primary/25 group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h2 className="text-xl font-semibold mb-1">Iniciar sesión de enfoque</h2>
                                <p className="text-white/80">25 minutos de concentración total</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/20 group-hover:scale-110 transition-transform">
                                <Play className="h-8 w-8" />
                            </div>
                        </div>
                    </button>
                </motion.div>

                {/* Today's stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                >
                    <div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
                        <Clock className="h-5 w-5 text-primary mb-2" />
                        <p className="text-2xl font-bold">{todayStats.focusTime}h</p>
                        <p className="text-xs text-muted-foreground">Tiempo enfocado</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-mint/5 to-mint/10">
                        <CheckCircle2 className="h-5 w-5 text-mint mb-2" />
                        <p className="text-2xl font-bold">{todayStats.completedTasks}</p>
                        <p className="text-xs text-muted-foreground">Tareas hoy</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-purple/5 to-purple/10">
                        <Target className="h-5 w-5 text-purple mb-2" />
                        <p className="text-2xl font-bold">{todayStats.pomodoros}</p>
                        <p className="text-xs text-muted-foreground">Pomodoros</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-coral/5 to-coral/10">
                        <Zap className="h-5 w-5 text-coral mb-2" />
                        <p className="text-2xl font-bold">{todayStats.streak} 🔥</p>
                        <p className="text-xs text-muted-foreground">Días de racha</p>
                    </div>
                </motion.div>

                {/* High priority tasks */}
                {highPriorityTasks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-coral" />
                            Alta prioridad
                        </h2>
                        <div className="space-y-2">
                            {highPriorityTasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 + index * 0.05 }}
                                    className="flex items-center gap-3 p-4 rounded-2xl border border-coral/30 bg-coral/5 hover:bg-coral/10 transition-colors group"
                                >
                                    <span className="text-xl">{task.spaceIcon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{task.title}</p>
                                        <p className="text-sm text-muted-foreground">{task.space}</p>
                                    </div>
                                    <button
                                        onClick={() => startFocus(task)}
                                        className="px-4 py-2 rounded-xl bg-coral text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-coral/90"
                                    >
                                        <Play className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* All tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Todas las tareas
                    </h2>
                    {tasksWithSpaces.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay tareas todavía</p>
                            <p className="text-sm">Creá tareas desde tus objetivos o espacios</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {tasksWithSpaces.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 + index * 0.03 }}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:bg-accent/50 transition-colors group",
                                        task.completed && "opacity-60"
                                    )}
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="flex-shrink-0"
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-mint" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                        )}
                                    </button>
                                    <span className="text-xl">{task.spaceIcon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "font-medium truncate",
                                            task.completed && "line-through text-muted-foreground"
                                        )}>
                                            {task.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{task.space}</p>
                                    </div>
                                    <span className={cn(
                                        "text-xs px-2 py-1 rounded-full",
                                        task.priority === "high" && "bg-coral/10 text-coral",
                                        task.priority === "medium" && "bg-yellow-500/10 text-yellow-600",
                                        task.priority === "low" && "bg-muted text-muted-foreground"
                                    )}>
                                        {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                                    </span>
                                    {!task.completed && (
                                        <button
                                            onClick={() => startFocus(task)}
                                            className="p-2 rounded-xl hover:bg-accent opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Play className="h-4 w-4" />
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Focus Mode overlay */}
            <FocusMode
                isOpen={isFocusModeOpen}
                onClose={() => setIsFocusModeOpen(false)}
                task={selectedTask ? {
                    id: selectedTask.id,
                    title: selectedTask.title,
                    space: selectedTask.space,
                    spaceIcon: selectedTask.spaceIcon,
                    completed: selectedTask.completed,
                } : undefined}
                onTaskComplete={handleTaskComplete}
            />
        </>
    );
}
