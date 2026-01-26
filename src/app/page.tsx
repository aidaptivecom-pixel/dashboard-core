"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Clock,
    Calendar,
    Inbox,
    FolderOpen,
    ArrowRight,
    CheckCircle2,
    Circle,
    Star,
    Plus,
    Target,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockData = {
    recentFiles: [
        { id: "1", name: "CRM - Contexto para Claude", space: "Aidaptive", icon: "🤖", type: "note", time: "Hace 30min" },
        { id: "2", name: "Inventario", space: "iGreen", icon: "🌱", type: "document", time: "Hace 2h" },
        { id: "3", name: "Diseño UI", space: "Limbo", icon: "🚀", type: "folder", time: "Hace 1h" },
        { id: "4", name: "Scripts Automatización", space: "Aidaptive", icon: "🤖", type: "code", time: "Hace 4h" },
    ],
    todayTasks: [
        { id: "1", title: "Revisar propuesta cliente ABC", done: false, space: "Aidaptive" },
        { id: "2", title: "Llamar proveedor plantas", done: false, space: "iGreen" },
        { id: "3", title: "Terminar componente hero", done: true, space: "Limbo" },
        { id: "4", title: "Responder emails pendientes", done: false, space: "Personal" },
    ],
    upcomingEvents: [
        { id: "1", title: "Daily Standup", time: "10:00", type: "meeting" },
        { id: "2", title: "Call con cliente", time: "14:00", type: "call" },
        { id: "3", title: "Deadline: Propuesta CRM", time: "18:00", type: "deadline" },
    ],
    captureCount: 3,
};

export default function Home() {
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");

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

    const completedTasks = mockData.todayTasks.filter(t => t.done).length;

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <p className="text-muted-foreground flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4" />
                        {currentTime} · {new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <h1 className="text-3xl font-bold">
                        {greeting}, <span className="text-gradient">Alex</span>
                    </h1>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <Link 
                        href="/capture"
                        className="p-4 rounded-2xl border border-border bg-background hover:bg-accent transition-colors"
                    >
                        <Inbox className="h-5 w-5 text-primary mb-2" />
                        <p className="text-2xl font-bold">{mockData.captureCount}</p>
                        <p className="text-xs text-muted-foreground">En captura</p>
                    </Link>
                    
                    <div className="p-4 rounded-2xl border border-border bg-background">
                        <CheckCircle2 className="h-5 w-5 text-mint mb-2" />
                        <p className="text-2xl font-bold">{completedTasks}/{mockData.todayTasks.length}</p>
                        <p className="text-xs text-muted-foreground">Tareas hoy</p>
                    </div>
                    
                    <div className="p-4 rounded-2xl border border-border bg-background">
                        <Calendar className="h-5 w-5 text-purple mb-2" />
                        <p className="text-2xl font-bold">{mockData.upcomingEvents.length}</p>
                        <p className="text-xs text-muted-foreground">Eventos hoy</p>
                    </div>
                    
                    <Link 
                        href="/goals"
                        className="p-4 rounded-2xl border border-border bg-background hover:bg-accent transition-colors"
                    >
                        <Target className="h-5 w-5 text-coral mb-2" />
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-xs text-muted-foreground">Objetivos activos</p>
                    </Link>
                </div>

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
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-accent transition-all text-left"
                                >
                                    <span className="text-2xl">{file.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.space} · {file.time}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Today's Tasks */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Hoy
                                </h2>
                                <button className="p-1 rounded-lg hover:bg-accent">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                {mockData.todayTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border border-border bg-background transition-colors",
                                            task.done && "opacity-60"
                                        )}
                                    >
                                        {task.done ? (
                                            <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm truncate",
                                                task.done && "line-through"
                                            )}>
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{task.space}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div>
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
                                {mockData.upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                                    >
                                        <span className="font-mono text-sm text-muted-foreground w-12">
                                            {event.time}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm">{event.title}</p>
                                        </div>
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            event.type === "meeting" && "bg-blue-500",
                                            event.type === "call" && "bg-green-500",
                                            event.type === "deadline" && "bg-coral"
                                        )} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
