"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Plus,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Circle,
    Calendar,
    Flag,
    MoreHorizontal,
    Sparkles,
    TrendingUp,
    Clock,
    ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
}

interface Objective {
    id: string;
    title: string;
    progress: number;
    tasks: Task[];
    dueDate?: string;
}

interface Goal {
    id: string;
    title: string;
    description: string;
    space: string;
    spaceIcon: string;
    color: string;
    progress: number;
    objectives: Objective[];
    dueDate?: string;
    status: "active" | "completed" | "paused";
}

const mockGoals: Goal[] = [
    {
        id: "1",
        title: "Lanzar Limbo MVP",
        description: "Tener la landing page funcionando con waitlist y primeros usuarios",
        space: "limbo",
        spaceIcon: "🚀",
        color: "#8B5CF6",
        progress: 45,
        status: "active",
        dueDate: "2026-02-28",
        objectives: [
            {
                id: "1a",
                title: "Diseño y UI",
                progress: 80,
                dueDate: "2026-02-10",
                tasks: [
                    { id: "t1", title: "Diseñar hero section", completed: true },
                    { id: "t2", title: "Crear componentes UI base", completed: true },
                    { id: "t3", title: "Diseñar sección de features", completed: true },
                    { id: "t4", title: "Diseñar footer y navegación", completed: false },
                ],
            },
            {
                id: "1b",
                title: "Desarrollo frontend",
                progress: 40,
                dueDate: "2026-02-20",
                tasks: [
                    { id: "t5", title: "Setup Next.js proyecto", completed: true },
                    { id: "t6", title: "Implementar landing page", completed: false },
                    { id: "t7", title: "Agregar animaciones", completed: false },
                    { id: "t8", title: "Responsive mobile", completed: false },
                ],
            },
            {
                id: "1c",
                title: "Backend y waitlist",
                progress: 10,
                dueDate: "2026-02-25",
                tasks: [
                    { id: "t9", title: "Configurar Supabase", completed: true },
                    { id: "t10", title: "Crear tabla waitlist", completed: false },
                    { id: "t11", title: "Integrar formulario", completed: false },
                    { id: "t12", title: "Email de confirmación", completed: false },
                ],
            },
        ],
    },
    {
        id: "2",
        title: "10 clientes activos en Aidaptive",
        description: "Conseguir 10 clientes pagando por servicios de automatización",
        space: "aidaptive",
        spaceIcon: "🤖",
        color: "#4F6BFF",
        progress: 60,
        status: "active",
        dueDate: "2026-03-31",
        objectives: [
            {
                id: "2a",
                title: "Generar leads",
                progress: 75,
                tasks: [
                    { id: "t13", title: "Optimizar perfil LinkedIn", completed: true },
                    { id: "t14", title: "Publicar 10 posts de contenido", completed: true },
                    { id: "t15", title: "Contactar 50 prospectos", completed: true },
                    { id: "t16", title: "Crear lead magnet", completed: false },
                ],
            },
            {
                id: "2b",
                title: "Cerrar ventas",
                progress: 50,
                tasks: [
                    { id: "t17", title: "Preparar propuesta estándar", completed: true },
                    { id: "t18", title: "Definir precios y paquetes", completed: true },
                    { id: "t19", title: "Cerrar cliente #7", completed: false },
                    { id: "t20", title: "Cerrar cliente #8", completed: false },
                    { id: "t21", title: "Cerrar cliente #9", completed: false },
                    { id: "t22", title: "Cerrar cliente #10", completed: false },
                ],
            },
        ],
    },
    {
        id: "3",
        title: "Organizar inventario iGreen",
        description: "Tener stock organizado y sistema de tracking funcionando",
        space: "igreen",
        spaceIcon: "🌱",
        color: "#10B981",
        progress: 20,
        status: "active",
        dueDate: "2026-02-15",
        objectives: [
            {
                id: "3a",
                title: "Catalogar productos",
                progress: 40,
                tasks: [
                    { id: "t23", title: "Listar todas las plantas", completed: true },
                    { id: "t24", title: "Fotografiar productos", completed: false },
                    { id: "t25", title: "Definir precios", completed: false },
                ],
            },
            {
                id: "3b",
                title: "Sistema de inventario",
                progress: 0,
                tasks: [
                    { id: "t26", title: "Elegir herramienta/sistema", completed: false },
                    { id: "t27", title: "Cargar productos", completed: false },
                    { id: "t28", title: "Definir alertas de stock", completed: false },
                ],
            },
        ],
    },
];

export default function GoalsPage() {
    const [goals, setGoals] = useState(mockGoals);
    const [expandedGoals, setExpandedGoals] = useState<string[]>([mockGoals[0].id]);
    const [expandedObjectives, setExpandedObjectives] = useState<string[]>([]);
    const [filter, setFilter] = useState<"all" | "active" | "completed">("active");

    const toggleGoal = (id: string) => {
        setExpandedGoals(prev => 
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const toggleObjective = (id: string) => {
        setExpandedObjectives(prev => 
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
        );
    };

    const toggleTask = (goalId: string, objectiveId: string, taskId: string) => {
        setGoals(goals.map(goal => {
            if (goal.id !== goalId) return goal;
            
            const newObjectives = goal.objectives.map(obj => {
                if (obj.id !== objectiveId) return obj;
                
                const newTasks = obj.tasks.map(task => 
                    task.id === taskId ? { ...task, completed: !task.completed } : task
                );
                
                const completedCount = newTasks.filter(t => t.completed).length;
                const progress = Math.round((completedCount / newTasks.length) * 100);
                
                return { ...obj, tasks: newTasks, progress };
            });
            
            const totalProgress = Math.round(
                newObjectives.reduce((acc, obj) => acc + obj.progress, 0) / newObjectives.length
            );
            
            return { ...goal, objectives: newObjectives, progress: totalProgress };
        }));
    };

    const filteredGoals = goals.filter(g => {
        if (filter === "all") return true;
        if (filter === "active") return g.status === "active";
        if (filter === "completed") return g.status === "completed";
        return true;
    });

    const totalProgress = Math.round(
        filteredGoals.reduce((acc, g) => acc + g.progress, 0) / (filteredGoals.length || 1)
    );

    const getDaysRemaining = (date?: string) => {
        if (!date) return null;
        const diff = new Date(date).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Target className="h-7 w-7" />
                            Objetivos
                        </h1>
                        <p className="text-muted-foreground">
                            Define metas, desglosa en objetivos, completa tareas
                        </p>
                    </div>
                    
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva meta
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="p-4 rounded-2xl border border-border bg-background">
                        <TrendingUp className="h-5 w-5 text-primary mb-2" />
                        <p className="text-2xl font-bold">{totalProgress}%</p>
                        <p className="text-xs text-muted-foreground">Progreso general</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-background">
                        <Target className="h-5 w-5 text-purple mb-2" />
                        <p className="text-2xl font-bold">{goals.filter(g => g.status === "active").length}</p>
                        <p className="text-xs text-muted-foreground">Metas activas</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-background">
                        <CheckCircle2 className="h-5 w-5 text-mint mb-2" />
                        <p className="text-2xl font-bold">
                            {goals.flatMap(g => g.objectives.flatMap(o => o.tasks)).filter(t => t.completed).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Tareas completadas</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-border bg-background">
                        <Clock className="h-5 w-5 text-coral mb-2" />
                        <p className="text-2xl font-bold">
                            {goals.flatMap(g => g.objectives.flatMap(o => o.tasks)).filter(t => !t.completed).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Tareas pendientes</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(["active", "all", "completed"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                filter === f
                                    ? "bg-primary text-white"
                                    : "bg-muted hover:bg-accent"
                            )}
                        >
                            {f === "active" ? "Activas" : f === "all" ? "Todas" : "Completadas"}
                        </button>
                    ))}
                </div>

                {/* Goals List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredGoals.map((goal) => {
                            const isExpanded = expandedGoals.includes(goal.id);
                            const daysRemaining = getDaysRemaining(goal.dueDate);
                            
                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="rounded-2xl border border-border bg-background overflow-hidden"
                                >
                                    {/* Goal Header */}
                                    <button
                                        onClick={() => toggleGoal(goal.id)}
                                        className="w-full p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors text-left"
                                    >
                                        <div 
                                            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl flex-shrink-0"
                                            style={{ backgroundColor: `${goal.color}15` }}
                                        >
                                            {goal.spaceIcon}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold truncate">{goal.title}</h3>
                                                {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-coral/10 text-coral flex-shrink-0">
                                                        {daysRemaining} días
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{goal.description}</p>
                                            
                                            {/* Progress bar */}
                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: goal.color }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${goal.progress}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium" style={{ color: goal.color }}>
                                                    {goal.progress}%
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <ChevronDown className={cn(
                                            "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                                            isExpanded && "rotate-180"
                                        )} />
                                    </button>

                                    {/* Objectives */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-border"
                                            >
                                                <div className="p-4 space-y-3">
                                                    {goal.objectives.map((objective) => {
                                                        const isObjExpanded = expandedObjectives.includes(objective.id);
                                                        const objDaysRemaining = getDaysRemaining(objective.dueDate);
                                                        
                                                        return (
                                                            <div 
                                                                key={objective.id}
                                                                className="rounded-xl border border-border overflow-hidden"
                                                            >
                                                                {/* Objective Header */}
                                                                <button
                                                                    onClick={() => toggleObjective(objective.id)}
                                                                    className="w-full p-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
                                                                >
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <Flag className="h-4 w-4" style={{ color: goal.color }} />
                                                                            <span className="font-medium text-sm">{objective.title}</span>
                                                                            {objDaysRemaining !== null && objDaysRemaining <= 5 && objDaysRemaining > 0 && (
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    ({objDaysRemaining}d)
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px]">
                                                                                <div
                                                                                    className="h-full rounded-full transition-all"
                                                                                    style={{ 
                                                                                        backgroundColor: goal.color,
                                                                                        width: `${objective.progress}%`
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {objective.tasks.filter(t => t.completed).length}/{objective.tasks.length}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <ChevronRight className={cn(
                                                                        "h-4 w-4 text-muted-foreground transition-transform",
                                                                        isObjExpanded && "rotate-90"
                                                                    )} />
                                                                </button>

                                                                {/* Tasks */}
                                                                <AnimatePresence>
                                                                    {isObjExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="border-t border-border bg-muted/30"
                                                                        >
                                                                            <div className="p-2 space-y-1">
                                                                                {objective.tasks.map((task) => (
                                                                                    <button
                                                                                        key={task.id}
                                                                                        onClick={() => toggleTask(goal.id, objective.id, task.id)}
                                                                                        className={cn(
                                                                                            "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                                                                                            "hover:bg-background",
                                                                                            task.completed && "opacity-60"
                                                                                        )}
                                                                                    >
                                                                                        {task.completed ? (
                                                                                            <CheckCircle2 
                                                                                                className="h-5 w-5 flex-shrink-0" 
                                                                                                style={{ color: goal.color }}
                                                                                            />
                                                                                        ) : (
                                                                                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                                                        )}
                                                                                        <span className={cn(
                                                                                            "text-sm",
                                                                                            task.completed && "line-through"
                                                                                        )}>
                                                                                            {task.title}
                                                                                        </span>
                                                                                    </button>
                                                                                ))}
                                                                                
                                                                                {/* Add task button */}
                                                                                <button className="w-full flex items-center gap-3 p-2 rounded-lg text-left text-muted-foreground hover:text-foreground hover:bg-background transition-colors">
                                                                                    <Plus className="h-5 w-5" />
                                                                                    <span className="text-sm">Agregar tarea</span>
                                                                                </button>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                    
                                                    {/* Add objective button */}
                                                    <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                                                        <Plus className="h-4 w-4" />
                                                        <span className="text-sm">Agregar objetivo</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredGoals.length === 0 && (
                    <div className="text-center py-12">
                        <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No hay metas {filter === "completed" ? "completadas" : "activas"}</p>
                        <button className="mt-4 text-primary hover:underline flex items-center gap-1 mx-auto">
                            <Plus className="h-4 w-4" />
                            Crear primera meta
                        </button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
