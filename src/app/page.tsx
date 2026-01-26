"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
    Play, 
    Clock, 
    Inbox, 
    AlertTriangle, 
    Calendar,
    Zap,
    ArrowRight,
    CheckCircle2,
    Circle,
    Coffee,
    Target,
    Sparkles
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";

// Mock data - vendrá de Supabase
const mockData = {
    user: {
        name: "Alex",
        hasCheckedIn: false,
        energy: null as "low" | "medium" | "high" | null,
        hoursPlanned: null as number | null,
    },
    alerts: [
        { id: "1", type: "error", title: "Deploy falló en producción", source: "GitHub", time: "hace 2h" },
        { id: "2", type: "urgent", title: "Email urgente de cliente", source: "Gmail", time: "hace 1h" },
    ],
    inboxCount: 5,
    meetings: [
        { id: "1", time: "10:00", title: "Daily Standup", duration: "30min" },
        { id: "2", time: "14:00", title: "Client Review", duration: "1h" },
    ],
    currentTask: {
        title: "Revisar propuesta cliente ABC",
        project: "Cliente ABC",
        projectColor: "#4F6BFF",
        duration: 45,
        progress: 1,
        total: 4,
    },
    todayTasks: [
        { id: "1", title: "Revisar propuesta cliente ABC", done: false, priority: "high" },
        { id: "2", title: "Responder emails", done: false, priority: "medium" },
        { id: "3", title: "Preparar presentación", done: false, priority: "low" },
        { id: "4", title: "Code review PR #234", done: true, priority: "medium" },
    ],
    deadlines: [
        { title: "Proyecto X", daysLeft: 2 },
        { title: "Entrega diseño", daysLeft: 4 },
    ],
};

export default function Home() {
    const [data, setData] = useState(mockData);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        // Check localStorage for check-in data
        const saved = localStorage.getItem("focusflow_checkin");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const today = new Date().toDateString();
                if (parsed.date === today) {
                    setData(d => ({
                        ...d,
                        user: {
                            ...d.user,
                            hasCheckedIn: true,
                            energy: parsed.energy,
                            hoursPlanned: parsed.hours,
                        }
                    }));
                }
            } catch (e) {}
        }

        // Update time
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const completedTasks = data.todayTasks.filter(t => t.done).length;
    const totalTasks = data.todayTasks.length;

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Hola, <span className="text-gradient">{data.user.name}</span>
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {currentTime} • {new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                    </div>

                    {/* Check-in CTA */}
                    {!data.user.hasCheckedIn ? (
                        <Link
                            href="/checkin"
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-purple text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            <Sparkles className="h-5 w-5" />
                            Planificar mi día
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-mint/10 text-mint-dark border border-mint/20">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                Plan activo: {data.user.hoursPlanned}h • Energía {data.user.energy === "low" ? "baja" : data.user.energy === "medium" ? "media" : "alta"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Alerts Banner */}
                {data.alerts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border-2 border-coral/30 bg-coral/5"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-coral" />
                            <span className="font-semibold text-coral">{data.alerts.length} alertas requieren atención</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.alerts.map(alert => (
                                <div key={alert.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background text-sm">
                                    <span>{alert.title}</span>
                                    <span className="text-xs text-muted-foreground">• {alert.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Current Task + Tasks */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Task */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Target className="h-5 w-5 text-primary" />
                                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Tarea actual</span>
                            </div>
                            
                            <h2 className="text-xl font-bold mb-3">{data.currentTask.title}</h2>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span 
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium"
                                    style={{ backgroundColor: `${data.currentTask.projectColor}15`, color: data.currentTask.projectColor }}
                                >
                                    {data.currentTask.project}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    {data.currentTask.duration} min
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {data.currentTask.progress}/{data.currentTask.total} pasos
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 btn-primary py-3">
                                    <Play className="h-4 w-4 mr-2" />
                                    Iniciar Focus
                                </button>
                                <Link 
                                    href="/checkin"
                                    className="btn-secondary py-3 px-4"
                                >
                                    Ver plan completo
                                </Link>
                            </div>
                        </motion.div>

                        {/* Today's Tasks */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-5 rounded-2xl border border-border bg-background"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Tareas de hoy</h3>
                                <span className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} completadas</span>
                            </div>
                            
                            <div className="space-y-2">
                                {data.todayTasks.map(task => (
                                    <div 
                                        key={task.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl transition-colors",
                                            task.done ? "bg-muted/50" : "hover:bg-accent"
                                        )}
                                    >
                                        {task.done ? (
                                            <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        )}
                                        <span className={cn("flex-1", task.done && "line-through text-muted-foreground")}>
                                            {task.title}
                                        </span>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            task.priority === "high" && "bg-coral/10 text-coral",
                                            task.priority === "medium" && "bg-yellow-500/10 text-yellow-600",
                                            task.priority === "low" && "bg-mint/10 text-mint-dark"
                                        )}>
                                            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Stats */}
                    <div className="space-y-4">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <Link 
                                href="/inbox"
                                className="p-4 rounded-2xl border border-border bg-background hover:bg-accent transition-colors"
                            >
                                <Inbox className="h-5 w-5 text-purple mb-2" />
                                <p className="text-2xl font-bold">{data.inboxCount}</p>
                                <p className="text-xs text-muted-foreground">En inbox</p>
                            </Link>
                            
                            <div className="p-4 rounded-2xl border border-border bg-background">
                                <Calendar className="h-5 w-5 text-primary mb-2" />
                                <p className="text-2xl font-bold">{data.meetings.length}</p>
                                <p className="text-xs text-muted-foreground">Reuniones hoy</p>
                            </div>
                        </div>

                        {/* Meetings */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Próximas reuniones
                            </h3>
                            <div className="space-y-2">
                                {data.meetings.map(meeting => (
                                    <div key={meeting.id} className="flex items-center gap-3 text-sm">
                                        <span className="font-mono text-muted-foreground w-12">{meeting.time}</span>
                                        <span className="flex-1">{meeting.title}</span>
                                        <span className="text-xs text-muted-foreground">{meeting.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Deadlines */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Deadlines
                            </h3>
                            <div className="space-y-2">
                                {data.deadlines.map((deadline, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span>{deadline.title}</span>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            deadline.daysLeft <= 2 ? "bg-coral/10 text-coral" : "bg-muted text-muted-foreground"
                                        )}>
                                            {deadline.daysLeft} días
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
