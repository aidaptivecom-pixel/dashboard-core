"use client";

import { usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Target,
    CheckCircle2,
    Circle,
    Inbox,
    Sparkles,
    Plus,
    Zap,
    TrendingUp,
    AlertTriangle,
    User,
    MessageSquare,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useProjectContext } from "@/hooks/useProjectContext";

// Mock data for non-space pages
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

// Helper to format relative time
function formatRelativeTime(dateString: string | null): string {
    if (!dateString) return "Sin actualizar";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        active: { label: "Activo", color: "text-emerald-400", bg: "bg-emerald-400/10" },
        paused: { label: "Pausado", color: "text-amber-400", bg: "bg-amber-400/10" },
        blocked: { label: "Bloqueado", color: "text-red-400", bg: "bg-red-400/10" },
        completed: { label: "Completado", color: "text-blue-400", bg: "bg-blue-400/10" },
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.color, config.bg)}>
            {config.label}
        </span>
    );
}

// Project Context Panel Component
function ProjectContextPanel({ spaceId }: { spaceId: string }) {
    const { context, loading, error } = useProjectContext(spaceId);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm text-red-400">Error cargando contexto</p>
            </div>
        );
    }

    if (!context) {
        return (
            <div className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <h3 className="font-semibold text-sm">Sin contexto</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                    Este espacio no tiene contexto de proyecto configurado.
                </p>
                <button className="w-full btn-secondary py-2 text-sm">
                    Configurar contexto
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Status & Phase */}
            <div className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Estado</h3>
                    <StatusBadge status={context.status} />
                </div>
                
                {context.current_phase && (
                    <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Fase actual</p>
                        <p className="text-sm font-medium">{context.current_phase}</p>
                    </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Actualizado {formatRelativeTime(context.updated_at)}</span>
                </div>
            </div>

            {/* Summary */}
            {context.summary && (
                <div className="rounded-2xl border border-border p-4">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        Resumen
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {context.summary.length > 200 
                            ? `${context.summary.substring(0, 200)}...` 
                            : context.summary}
                    </p>
                </div>
            )}

            {/* Next Actions */}
            {context.next_actions && context.next_actions.length > 0 && (
                <div className="rounded-2xl border border-border p-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Próximas acciones
                    </h3>
                    <ul className="space-y-2">
                        {context.next_actions.slice(0, 4).map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Circle className="h-3 w-3 mt-1.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm">
                                    {typeof action === 'string' ? action : action.action}
                                </span>
                            </li>
                        ))}
                    </ul>
                    {context.next_actions.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">
                            +{context.next_actions.length - 4} más
                        </p>
                    )}
                </div>
            )}

            {/* Next Milestone */}
            {context.next_milestone && (
                <div className="rounded-2xl border border-border p-4">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        Próximo milestone
                    </h3>
                    <p className="text-sm font-medium">{context.next_milestone}</p>
                    {context.next_milestone_date && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(context.next_milestone_date).toLocaleDateString('es-AR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    )}
                </div>
            )}

            {/* Client Info */}
            {context.client_name && (
                <div className="rounded-2xl border border-border p-4">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-400" />
                        Cliente
                    </h3>
                    <p className="text-sm font-medium">{context.client_name}</p>
                    {context.last_client_update && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Última comunicación: {formatRelativeTime(context.last_client_update)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export function RightPanel() {
    const pathname = usePathname();
    const params = useParams();

    // Determine which content to show based on current page
    const isHome = pathname === "/";
    const isCapture = pathname === "/capture";
    const isCalendar = pathname === "/calendar";
    const isGoals = pathname === "/goals";
    const isSpace = pathname.startsWith("/spaces/");
    
    // Get space ID from URL params
    const spaceId = params?.id as string;

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

                {/* SPACES: Project Context */}
                {isSpace && spaceId && (
                    <ProjectContextPanel spaceId={spaceId} />
                )}

                {/* Bottom padding */}
                <div className="h-4 flex-shrink-0" />
            </div>
        </aside>
    );
}
