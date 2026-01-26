"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Play, 
    SkipForward, 
    Shuffle,
    Coffee,
    Phone,
    CheckCircle2,
    Circle,
    Clock,
    Inbox,
    AlertTriangle,
    Zap,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DayPlanProps {
    energy: "low" | "medium" | "high";
    hours: number;
}

// Genera el plan basado en energía y horas
const generateDayPlan = (energy: string, hours: number) => {
    const blockMinutes = energy === "low" ? 25 : energy === "medium" ? 45 : 60;
    const breakMinutes = energy === "low" ? 10 : 5;
    
    return {
        blockMinutes,
        breakMinutes,
        currentTask: {
            title: "Revisar propuesta cliente ABC",
            project: "Cliente ABC",
            projectColor: "#4F6BFF",
            duration: blockMinutes,
            priority: "high" as const,
            reason: "Es urgente y tu energía es ideal para tareas de análisis por la mañana",
            miniSteps: [
                { id: "1", text: "Abrir documento en Drive", done: false },
                { id: "2", text: "Leer sección de precios", done: false },
                { id: "3", text: "Anotar 3 dudas principales", done: false },
                { id: "4", text: "Enviar feedback al equipo", done: false },
            ],
        },
        schedule: [
            { time: "09:00", title: "Revisar propuesta cliente", type: "work" as const, duration: blockMinutes, active: true },
            { time: "09:45", title: "Micro-descanso", type: "break" as const, duration: breakMinutes },
            { time: "09:50", title: "Preparar para reunión", type: "work" as const, duration: 10 },
            { time: "10:00", title: "Daily Standup", type: "meeting" as const, duration: 30 },
            { time: "10:30", title: "Responder emails urgentes", type: "work" as const, duration: blockMinutes },
            { time: "11:15", title: "Descanso largo", type: "break" as const, duration: 10 },
            { time: "11:25", title: "Procesar inbox", type: "work" as const, duration: 35 },
            { time: "12:00", title: "Almuerzo", type: "break" as const, duration: 60 },
        ],
        stats: {
            inboxCount: 5,
            alertsCount: 2,
            nextMeeting: "45 min",
        }
    };
};

export function DayPlanView({ energy, hours }: DayPlanProps) {
    const plan = generateDayPlan(energy, hours);
    const [steps, setSteps] = useState(plan.currentTask.miniSteps);

    const toggleStep = (id: string) => {
        setSteps(steps.map(s => s.id === id ? { ...s, done: !s.done } : s));
    };

    const completedSteps = steps.filter(s => s.done).length;
    const progress = (completedSteps / steps.length) * 100;

    const energyLabel = energy === "low" ? "Baja" : energy === "medium" ? "Media" : "Alta";
    const energyColor = energy === "low" ? "text-coral" : energy === "medium" ? "text-yellow-500" : "text-mint";

    return (
        <div className="space-y-6">
            {/* Status Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-muted/50">
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-sm", energyColor)}>
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">Energía {energyLabel}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{hours}h disponibles</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>Reunión en {plan.stats.nextMeeting}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-sm ml-auto">
                    <Inbox className="h-4 w-4 text-purple" />
                    <span>{plan.stats.inboxCount}</span>
                </div>
                {plan.stats.alertsCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/10 text-coral text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{plan.stats.alertsCount}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Task - Main focus */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="h-5 w-5 text-primary" />
                            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Ahora</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">{plan.currentTask.title}</h2>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span 
                                className="px-2.5 py-1 rounded-lg text-xs font-medium"
                                style={{ backgroundColor: `${plan.currentTask.projectColor}15`, color: plan.currentTask.projectColor }}
                            >
                                {plan.currentTask.project}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {plan.currentTask.duration} min
                            </span>
                        </div>

                        {/* Why this task */}
                        <div className="p-3 rounded-xl bg-muted/50 mb-4">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">¿Por qué esta tarea?</span> {plan.currentTask.reason}
                            </p>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progreso</span>
                                <span className="font-medium">{completedSteps}/{steps.length}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Mini Steps */}
                        <div className="space-y-2 mb-6">
                            <p className="text-sm font-medium mb-2">Mini-pasos:</p>
                            {steps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => toggleStep(step.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                                        step.done 
                                            ? "bg-mint/10 line-through text-muted-foreground" 
                                            : "bg-background hover:bg-accent border border-border"
                                    )}
                                >
                                    {step.done ? (
                                        <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span className="text-sm">{step.text}</span>
                                </button>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className="flex-1 btn-primary py-3 text-base">
                                <Play className="h-5 w-5 mr-2" />
                                Iniciar Focus ({plan.currentTask.duration}min)
                            </button>
                            <button className="p-3 rounded-xl border border-border hover:bg-accent transition-colors" title="Saltar">
                                <SkipForward className="h-5 w-5" />
                            </button>
                            <button className="p-3 rounded-xl border border-border hover:bg-accent transition-colors" title="Cambiar tarea">
                                <Shuffle className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Schedule Sidebar */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-2xl border border-border bg-background"
                    >
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Plan del día
                        </h3>
                        <div className="space-y-1">
                            {plan.schedule.map((item, i) => (
                                <div 
                                    key={i}
                                    className={cn(
                                        "flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
                                        item.active && "bg-primary/10 border border-primary/20",
                                        item.type === "break" && "text-muted-foreground"
                                    )}
                                >
                                    <span className="font-mono text-xs w-10 text-muted-foreground">{item.time}</span>
                                    {item.type === "break" && <Coffee className="h-3 w-3 flex-shrink-0" />}
                                    {item.type === "meeting" && <Phone className="h-3 w-3 text-primary flex-shrink-0" />}
                                    <span className={cn("flex-1 truncate", item.type === "break" && "italic")}>
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{item.duration}m</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        <button className="p-3 rounded-xl border border-border hover:bg-accent transition-all text-sm flex items-center justify-center gap-2">
                            <Inbox className="h-4 w-4" />
                            Inbox
                        </button>
                        <button className="p-3 rounded-xl border border-coral/30 bg-coral/5 text-coral hover:bg-coral/10 transition-all text-sm flex items-center justify-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Alertas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
