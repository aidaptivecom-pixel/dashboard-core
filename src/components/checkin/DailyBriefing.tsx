"use client";

import { motion } from "framer-motion";
import { 
    AlertTriangle, 
    Calendar, 
    Inbox, 
    Clock, 
    ArrowRight, 
    XCircle,
    FileWarning,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefingData {
    energy: "low" | "medium" | "high";
    hours: number;
}

interface DailyBriefingProps {
    data: BriefingData;
    onContinue: () => void;
}

// Mock data - esto vendrá de Supabase + integraciones
const mockBriefing = {
    alerts: [
        { id: "1", type: "error", title: "Deploy falló en producción", source: "GitHub Actions", time: "hace 2h" },
        { id: "2", type: "urgent", title: "Email urgente de cliente", source: "Gmail", time: "hace 1h" },
    ],
    meetings: [
        { id: "1", time: "10:00", title: "Daily Standup", duration: "30min", platform: "meet" },
        { id: "2", time: "14:00", title: "Client Review", duration: "1h", platform: "zoom" },
    ],
    deadlines: [
        { id: "1", title: "Proyecto X - Entrega", daysLeft: 2 },
        { id: "2", title: "Revisión propuesta", daysLeft: 4 },
    ],
    inboxCount: 5,
    pendingFromYesterday: "Revisar propuesta cliente ABC",
};

export function DailyBriefing({ data, onContinue }: DailyBriefingProps) {
    const energyLabel = data.energy === "low" ? "baja 🔋" : data.energy === "medium" ? "media ⚡" : "alta 🚀";

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">📋 Tu día en 30 segundos</h1>
                    <p className="text-muted-foreground">
                        Energía {energyLabel} • {data.hours} horas disponibles
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Alerts - Prioritario */}
                    {mockBriefing.alerts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-4 rounded-2xl border-2 border-coral/30 bg-coral/5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-5 w-5 text-coral" />
                                <h3 className="font-semibold text-coral">Requiere atención</h3>
                            </div>
                            <div className="space-y-2">
                                {mockBriefing.alerts.map((alert) => (
                                    <div key={alert.id} className="flex items-center gap-3 p-3 rounded-xl bg-background">
                                        {alert.type === "error" ? (
                                            <XCircle className="h-4 w-4 text-coral flex-shrink-0" />
                                        ) : (
                                            <Mail className="h-4 w-4 text-coral flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{alert.title}</p>
                                            <p className="text-xs text-muted-foreground">{alert.source} • {alert.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Reuniones */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-2xl border border-border bg-background"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Reuniones hoy</h3>
                            <span className="ml-auto text-sm text-muted-foreground">{mockBriefing.meetings.length}</span>
                        </div>
                        <div className="space-y-2">
                            {mockBriefing.meetings.map((meeting) => (
                                <div key={meeting.id} className="flex items-center gap-3 text-sm">
                                    <span className="font-mono text-muted-foreground w-12">{meeting.time}</span>
                                    <span className="flex-1">{meeting.title}</span>
                                    <span className="text-xs text-muted-foreground">{meeting.duration}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Grid: Deadlines + Inbox + Pendiente */}
                    <div className="grid grid-cols-3 gap-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <Clock className="h-5 w-5 text-yellow-500 mb-2" />
                            <p className="text-2xl font-bold">{mockBriefing.deadlines.length}</p>
                            <p className="text-xs text-muted-foreground">Deadlines próximos</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <Inbox className="h-5 w-5 text-purple mb-2" />
                            <p className="text-2xl font-bold">{mockBriefing.inboxCount}</p>
                            <p className="text-xs text-muted-foreground">Items en inbox</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-4 rounded-2xl border border-border bg-background"
                        >
                            <FileWarning className="h-5 w-5 text-mint mb-2" />
                            <p className="text-2xl font-bold">1</p>
                            <p className="text-xs text-muted-foreground">Pendiente de ayer</p>
                        </motion.div>
                    </div>

                    {/* Pendiente de ayer */}
                    {mockBriefing.pendingFromYesterday && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/5"
                        >
                            <p className="text-sm text-muted-foreground mb-1">Dejaste pendiente ayer:</p>
                            <p className="font-medium">{mockBriefing.pendingFromYesterday}</p>
                        </motion.div>
                    )}
                </div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={onContinue}
                    className="btn-primary w-full py-4 mt-6"
                >
                    Entendido, ¿qué hago primero?
                    <ArrowRight className="h-4 w-4 ml-2" />
                </motion.button>
            </motion.div>
        </div>
    );
}
