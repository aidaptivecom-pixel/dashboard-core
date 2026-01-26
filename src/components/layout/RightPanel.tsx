"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Target,
    CheckCircle2,
    Circle,
    Inbox,
    Sparkles,
    ArrowRight,
    Plus,
    Zap,
    FolderOpen,
    FileText,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock data
const todayEvents = [
    { id: "1", title: "Daily Standup", time: "10:00", type: "meeting", color: "#4F6BFF" },
    { id: "2", title: "Call con cliente", time: "14:00", type: "call", color: "#10B981" },
    { id: "3", title: "Deadline: Propuesta", time: "18:00", type: "deadline", color: "#EF4444" },
];

const quickTasks = [
    { id: "1", title: "Revisar propuesta ABC", done: false, space: "🤖" },
    { id: "2", title: "Llamar proveedor", done: false, space: "🌱" },
    { id: "3", title: "Terminar hero section", done: true, space: "🚀" },
];

const recentCaptures = [
    { id: "1", content: "Idea: Integración con Notion", type: "idea", time: "10min" },
    { id: "2", content: "Screenshot diseño", type: "image", time: "1h" },
    { id: "3", content: "Nota de voz", type: "voice", time: "2h" },
];

const goalProgress = [
    { id: "1", title: "Lanzar Limbo MVP", progress: 45, icon: "🚀" },
    { id: "2", title: "10 clientes Aidaptive", progress: 60, icon: "🤖" },
];

export function RightPanel() {
    const pathname = usePathname();

    // Determine which content to show based on current page
    const isHome = pathname === "/";
    const isCapture = pathname === "/capture";
    const isCalendar = pathname === "/calendar";
    const isGoals = pathname === "/goals";
    const isSpace = pathname.startsWith("/spaces/");

    return (
        <aside className="w-80 2xl:w-96 h-full bg-background flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto custom-scrollbar">
                
                {/* HOME: Today's events + Quick tasks */}
                {isHome && (
                    <>
                        {/* Today's Schedule */}
                        <div className="rounded-2xl border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Hoy
                                </h3>
                                <Link href="/calendar" className="text-xs text-primary hover:underline">
                                    Ver todo
                                </Link>
                            </div>
                            <div className="space-y-2">
                                {todayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors"
                                    >
                                        <div 
                                            className="w-1 h-8 rounded-full"
                                            style={{ backgroundColor: event.color }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">{event.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Tasks */}
                        <div className="rounded-2xl border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    Tareas rápidas
                                </h3>
                                <button className="p-1 rounded-lg hover:bg-accent">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {quickTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors",
                                            task.done && "opacity-50"
                                        )}
                                    >
                                        {task.done ? (
                                            <CheckCircle2 className="h-4 w-4 text-mint flex-shrink-0" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        )}
                                        <span className={cn(
                                            "text-sm flex-1 truncate",
                                            task.done && "line-through"
                                        )}>
                                            {task.title}
                                        </span>
                                        <span className="text-xs">{task.space}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Goal Progress */}
                        <div className="rounded-2xl border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Target className="h-4 w-4 text-purple" />
                                    Objetivos
                                </h3>
                                <Link href="/goals" className="text-xs text-primary hover:underline">
                                    Ver todo
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {goalProgress.map((goal) => (
                                    <div key={goal.id}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm">{goal.icon}</span>
                                            <span className="text-sm truncate flex-1">{goal.title}</span>
                                            <span className="text-xs font-medium">{goal.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${goal.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* CAPTURE: Recent captures + AI organize */}
                {isCapture && (
                    <>
                        <div className="rounded-2xl border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple" />
                                    Organizar con IA
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Claude puede analizar tus capturas y moverlas automáticamente al espacio correcto.
                            </p>
                            <button className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Organizar todo
                            </button>
                        </div>

                        <div className="rounded-2xl border border-border p-4">
                            <h3 className="font-semibold flex items-center gap-2 mb-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                Últimas capturas
                            </h3>
                            <div className="space-y-2">
                                {recentCaptures.map((capture) => (
                                    <div
                                        key={capture.id}
                                        className="p-2 rounded-xl hover:bg-accent transition-colors"
                                    >
                                        <p className="text-sm truncate">{capture.content}</p>
                                        <p className="text-xs text-muted-foreground">Hace {capture.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-border p-4 text-center">
                            <Inbox className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                                Arrastra archivos aquí o usa el input para capturar
                            </p>
                        </div>
                    </>
                )}

                {/* CALENDAR: Mini calendar + upcoming */}
                {isCalendar && (
                    <>
                        <div className="rounded-2xl border border-border p-4">
                            <h3 className="font-semibold flex items-center gap-2 mb-3">
                                <Clock className="h-4 w-4 text-primary" />
                                Próximas horas
                            </h3>
                            <div className="space-y-2">
                                {todayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors"
                                    >
                                        <span className="font-mono text-sm text-muted-foreground w-12">
                                            {event.time}
                                        </span>
                                        <div 
                                            className="w-1 h-8 rounded-full"
                                            style={{ backgroundColor: event.color }}
                                        />
                                        <span className="text-sm truncate">{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border p-4">
                            <h3 className="font-semibold mb-3">Agregar evento</h3>
                            <button className="w-full btn-secondary py-2.5 flex items-center justify-center gap-2">
                                <Plus className="h-4 w-4" />
                                Nuevo evento
                            </button>
                        </div>
                    </>
                )}

                {/* GOALS: Progress overview */}
                {isGoals && (
                    <>
                        <div className="rounded-2xl border border-border p-4">
                            <h3 className="font-semibold flex items-center gap-2 mb-3">
                                <TrendingUp className="h-4 w-4 text-mint" />
                                Resumen
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-muted/50 text-center">
                                    <p className="text-2xl font-bold">52%</p>
                                    <p className="text-xs text-muted-foreground">Progreso total</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/50 text-center">
                                    <p className="text-2xl font-bold">3</p>
                                    <p className="text-xs text-muted-foreground">Metas activas</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/50 text-center">
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-xs text-muted-foreground">Completadas</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/50 text-center">
                                    <p className="text-2xl font-bold">8</p>
                                    <p className="text-xs text-muted-foreground">Pendientes</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border p-4">
                            <h3 className="font-semibold mb-3">Crear meta</h3>
                            <button className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                                <Plus className="h-4 w-4" />
                                Nueva meta
                            </button>
                        </div>
                    </>
                )}

                {/* SPACES: Space info + recent files */}
                {isSpace && (
                    <>
                        <div className="rounded-2xl border border-border p-4">
                            <h3 className="font-semibold flex items-center gap-2 mb-3">
                                <FolderOpen className="h-4 w-4 text-primary" />
                                Acciones
                            </h3>
                            <div className="space-y-2">
                                <button className="w-full btn-secondary py-2 flex items-center justify-center gap-2 text-sm">
                                    <Plus className="h-4 w-4" />
                                    Nueva carpeta
                                </button>
                                <button className="w-full btn-secondary py-2 flex items-center justify-center gap-2 text-sm">
                                    <FileText className="h-4 w-4" />
                                    Nueva nota
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple" />
                                    Contexto IA
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Genera un resumen de este espacio para usar en Claude Code.
                            </p>
                            <button className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Generar contexto
                            </button>
                        </div>
                    </>
                )}

                {/* Bottom padding */}
                <div className="h-4 flex-shrink-0" />
            </div>
        </aside>
    );
}
