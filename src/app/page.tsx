"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Clock,
    Calendar,
    Inbox,
    FolderOpen,
    ArrowRight,
    CheckCircle2,
    Circle,
    Plus,
    Target,
    Zap,
    TrendingUp,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockData = {
    recentFiles: [
        { id: "1", name: "CRM - Contexto para Claude", space: "Aidaptive", icon: "🤖", type: "note", time: "Hace 30min", color: "#4F6BFF" },
        { id: "2", name: "Inventario", space: "iGreen", icon: "🌱", type: "document", time: "Hace 2h", color: "#10B981" },
        { id: "3", name: "Diseño UI", space: "Limbo", icon: "🚀", type: "folder", time: "Hace 1h", color: "#8B5CF6" },
        { id: "4", name: "Scripts Automatización", space: "Aidaptive", icon: "🤖", type: "code", time: "Hace 4h", color: "#4F6BFF" },
    ],
    todayTasks: [
        { id: "1", title: "Revisar propuesta cliente ABC", done: false, space: "Aidaptive", icon: "🤖" },
        { id: "2", title: "Llamar proveedor plantas", done: false, space: "iGreen", icon: "🌱" },
        { id: "3", title: "Terminar componente hero", done: true, space: "Limbo", icon: "🚀" },
        { id: "4", title: "Responder emails pendientes", done: false, space: "Personal", icon: "👤" },
    ],
    upcomingEvents: [
        { id: "1", title: "Daily Standup", time: "10:00", type: "meeting", color: "#4F6BFF" },
        { id: "2", title: "Call con cliente", time: "14:00", type: "call", color: "#10B981" },
        { id: "3", title: "Deadline: Propuesta CRM", time: "18:00", type: "deadline", color: "#EF4444" },
    ],
    captureCount: 3,
    weekProgress: 68,
    streak: 5,
};

// Animated number component
function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = value / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{displayValue}</span>;
}

// Progress ring component
function ProgressRing({ progress, size = 44, strokeWidth = 4, color = "#4F6BFF" }: { 
    progress: number; 
    size?: number; 
    strokeWidth?: number;
    color?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="progress-ring">
            <circle
                stroke="currentColor"
                className="text-muted/30"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <motion.circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    strokeDasharray: circumference,
                }}
            />
        </svg>
    );
}

export default function Home() {
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");
    const [tasks, setTasks] = useState(mockData.todayTasks);

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
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => 
            t.id === id ? { ...t, done: !t.done } : t
        ));
    };

    const completedTasks = tasks.filter(t => t.done).length;
    const taskProgress = Math.round((completedTasks / tasks.length) * 100);

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-muted-foreground flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4" />
                        {currentTime} · {new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <h1 className="text-3xl font-bold">
                        {greeting}, <span className="text-gradient">Alex</span>
                    </h1>
                </motion.div>

                {/* Quick Stats - Enhanced */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link 
                            href="/capture"
                            className="block p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Inbox className="h-5 w-5 text-primary" />
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                    Nuevo
                                </span>
                            </div>
                            <p className="text-3xl font-bold">
                                <AnimatedNumber value={mockData.captureCount} />
                            </p>
                            <p className="text-xs text-muted-foreground">En captura</p>
                            <ArrowRight className="h-4 w-4 text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="p-4 rounded-2xl border border-border bg-gradient-to-br from-mint/5 to-mint/10"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <CheckCircle2 className="h-5 w-5 text-mint mb-2" />
                                <p className="text-3xl font-bold">{completedTasks}/{tasks.length}</p>
                                <p className="text-xs text-muted-foreground">Tareas hoy</p>
                            </div>
                            <ProgressRing progress={taskProgress} color="#4ECDC4" />
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-2xl border border-border bg-gradient-to-br from-purple/5 to-purple/10"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <Calendar className="h-5 w-5 text-purple mb-2" />
                                <p className="text-3xl font-bold">
                                    <AnimatedNumber value={mockData.upcomingEvents.length} />
                                </p>
                                <p className="text-xs text-muted-foreground">Eventos hoy</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {mockData.upcomingEvents.slice(0, 2).map(e => (
                                    <div 
                                        key={e.id}
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: e.color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Link 
                            href="/goals"
                            className="block p-4 rounded-2xl border border-border bg-gradient-to-br from-coral/5 to-coral/10 hover:from-coral/10 hover:to-coral/20 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Target className="h-5 w-5 text-coral" />
                                <div className="flex items-center gap-1 text-xs text-coral">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{mockData.weekProgress}%</span>
                                </div>
                            </div>
                            <p className="text-3xl font-bold">2</p>
                            <p className="text-xs text-muted-foreground">Objetivos activos</p>
                            <ArrowRight className="h-4 w-4 text-coral mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                </div>

                {/* Streak Banner */}
                {mockData.streak > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/20 flex items-center gap-4"
                    >
                        <div className="text-3xl">🔥</div>
                        <div className="flex-1">
                            <p className="font-semibold">{mockData.streak} días de racha</p>
                            <p className="text-sm text-muted-foreground">¡Seguí así! Completaste tareas {mockData.streak} días seguidos.</p>
                        </div>
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Files */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold flex items-center gap-2">
                                <FolderOpen className="h-5 w-5" />
                                Recientes
                            </h2>
                            <button className="text-sm text-primary hover:underline">Ver todos</button>
                        </div>
                        
                        <div className="space-y-2">
                            {mockData.recentFiles.map((file, index) => (
                                <motion.button
                                    key={file.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    whileHover={{ scale: 1.01, x: 4 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all text-left group"
                                >
                                    <div 
                                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                                        style={{ backgroundColor: `${file.color}15` }}
                                    >
                                        {file.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate group-hover:text-primary transition-colors">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.space} · {file.time}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Today's Tasks */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    Hoy
                                </h2>
                                <button className="p-1 rounded-lg hover:bg-accent transition-colors">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {tasks.map((task) => (
                                        <motion.button
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8, x: 100 }}
                                            onClick={() => toggleTask(task.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-accent/50 transition-all text-left",
                                                task.done && "opacity-60 bg-muted/30"
                                            )}
                                        >
                                            <motion.div
                                                animate={task.done ? { scale: [1, 1.3, 1] } : {}}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {task.done ? (
                                                    <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 hover:text-primary transition-colors" />
                                                )}
                                            </motion.div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm truncate transition-all",
                                                    task.done && "line-through text-muted-foreground"
                                                )}>
                                                    {task.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <span>{task.icon}</span>
                                                    {task.space}
                                                </p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Upcoming Events */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Próximo
                                </h2>
                                <Link href="/calendar" className="text-xs text-primary hover:underline">
                                    Ver calendario
                                </Link>
                            </div>
                            
                            <div className="space-y-2">
                                {mockData.upcomingEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/20 transition-all cursor-pointer"
                                    >
                                        <span className="font-mono text-sm text-muted-foreground w-12">
                                            {event.time}
                                        </span>
                                        <div 
                                            className="w-1 h-8 rounded-full"
                                            style={{ backgroundColor: event.color }}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm">{event.title}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
