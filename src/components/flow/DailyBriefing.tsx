"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    AlertTriangle, 
    Mail, 
    Calendar, 
    Inbox, 
    Clock, 
    ArrowRight,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyBriefingProps {
    energy: "low" | "medium" | "high";
    hours: number;
    onContinue: () => void;
}

// Mock data - will come from backend
const briefingData = {
    meetings: [
        { time: "10:00", title: "Daily Standup", duration: "30min" },
        { time: "14:00", title: "Client Review", duration: "1h" },
    ],
    deadlines: [
        { title: "Proyecto X", date: "Miércoles", daysLeft: 2 },
        { title: "Entrega diseño", date: "Viernes", daysLeft: 4 },
    ],
    inboxCount: 5,
    pendingFromYesterday: "Revisar propuesta cliente ABC",
    alerts: [
        { type: "error", message: "Deploy falló anoche", action: "Ver logs" },
        { type: "urgent", message: "Email urgente de cliente", action: "Leer" },
    ],
};

export function DailyBriefing({ energy, hours, onContinue }: DailyBriefingProps) {
    const [seen, setSeen] = useState<Set<number>>(new Set());

    return (
        <div className="min-h-full flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">📋 Tu día en 30 segundos</h1>
                    <p className="text-muted-foreground">
                        Energía {energy === "low" ? "baja 🔋" : energy === "medium" ? "media ⚡" : "alta 🚀"} • {hours} horas disponibles
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Alerts - Most Important */}
                    {briefingData.alerts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-4 rounded-2xl border-2 border-coral/50 bg-coral/5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-5 w-5 text-coral" />
                                <h3 className="font-semibold text-coral">Requiere atención</h3>
                            </div>
                            <div className="space-y-2">
                                {briefingData.alerts.map((alert, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-background">
                                        <div className="flex items-center gap-2">
                                            {alert.type === "error" ? (
                                                <XCircle className="h-4 w-4 text-coral" />
                                            ) : (
                                                <Mail className="h-4 w-4 text-coral" />
                                            )}
                                            <span className="text-sm">{alert.message}</span>
                                        </div>
                                        <button className="text-xs text-primary hover:underline">{alert.action}</button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Meetings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-2xl border border-border bg-background"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Reuniones hoy</h3>
                            <span className="ml-auto text-sm text-muted-foreground">{briefingData.meetings.length} reuniones</span>
                        </div>
                        <div className="space-y-2">
                            {briefingData.meetings.map((meeting, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <span className="font-mono text-muted-foreground w-14">{meeting.time}</span>
                                    <span className="flex-1">{meeting.title}</span>
                                    <span className="text-xs text-muted-foreground">{meeting.duration}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Grid: Deadlines + Inbox + Pending */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Deadlines */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="h-4 w-4 text-yellow-500" />
                                <h3 className="font-medium text-sm">Deadlines</h3>
                            </div>
                            <div className="space-y-2">
                                {briefingData.deadlines.map((d, i) => (
                                    <div key={i} className="text-sm">
                                        <p className="font-medium truncate">{d.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {d.date} ({d.daysLeft} días)
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Inbox */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Inbox className="h-4 w-4 text-purple" />
                                <h3 className="font-medium text-sm">Inbox</h3>
                            </div>
                            <p className="text-3xl font-bold">{briefingData.inboxCount}</p>
                            <p className="text-xs text-muted-foreground">items sin procesar</p>
                        </motion.div>

                        {/* Pending from yesterday */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="h-4 w-4 text-mint" />
                                <h3 className="font-medium text-sm">Pendiente</h3>
                            </div>
                            <p className="text-sm line-clamp-2">{briefingData.pendingFromYesterday}</p>
                            <p className="text-xs text-muted-foreground mt-1">de ayer</p>
                        </motion.div>
                    </div>
                </div>

                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                >
                    <button
                        onClick={onContinue}
                        className="w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-all"
                    >
                        Entendido, ¿qué hago primero?
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
