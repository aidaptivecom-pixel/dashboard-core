"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
    Target,
    Plus,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Circle,
    Flag,
    TrendingUp,
    Clock,
    Sparkles,
    Trophy,
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

// Progress ring component
function ProgressRing({ progress, size = 60, strokeWidth = 5, color = "#4F6BFF" }: { 
    progress: number; 
    size?: number; 
    strokeWidth?: number;
    color?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="progress-ring -rotate-90">
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
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{progress}%</span>
            </div>
        </div>
    );
}

export default function GoalsPage() {
    const [goals, setGoals] = useState(mockGoals);
    const [expandedGoals, setExpandedGoals] = useState<string[]>([mockGoals[0].id]);
    const [expandedObjectives, setExpandedObjectives] = useState<string[]>([]);
    const [filter, setFilter] = useState<"all" | "active" | "completed">("active");
    const [celebratingTask, setCelebratingTask] = useState<string | null>(null);

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

    const triggerCelebration = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const toggleTask = (goalId: string, objectiveId: string, taskId: string) => {
        setGoals(goals.map(goal => {
            if (goal.id !== goalId) return goal;
            
            const newObjectives = goal.objectives.map(obj => {
                if (obj.id !== objectiveId) return obj;
                
                const newTasks = obj.tasks.map(task => {
                    if (task.id === taskId) {
                        const newCompleted = !task.completed;
                        if (newCompleted) {
                            setCelebratingTask(taskId);
                            setTimeout(() => setCelebratingTask(null), 600);
                        }
                        return { ...task, completed: newCompleted };
                    }
                    return task;
                });
                
                const completedCount = newTasks.filter(t => t.completed).length;
                const progress = Math.round((completedCount / newTasks.length) * 100);
                
                // Check if objective just completed
                if (progress === 100 && obj.progress < 100) {
                    triggerCelebration();
                }
                
                return { ...obj, tasks: newTasks, progress };
            });
            
            const totalProgress = Math.round(
                newObjectives.reduce((acc, obj) => acc + obj.progress, 0) / newObjectives.length
            );
            
            // Check if goal just completed
            if (totalProgress === 100 && goal.progress < 100) {
                setTimeout(triggerCelebration, 300);
            }
            
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

    const totalTasks = goals.flatMap(g => g.objectives.flatMap(o => o.tasks));
    const completedTasks = totalTasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks.filter(t => !t.completed).length;

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
                <motion.div 
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
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
                </motion.div>

                {/* Stats - Enhanced */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <motion.div 
                        className="p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <TrendingUp className="h-5 w-5 text-primary mb-2" />
                                <p className="text-xs text-muted-foreground">Progreso</p>
                            </div>
                            <ProgressRing progress={totalProgress} size={50} color="#4F6BFF" />
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="p-4 rounded-2xl border border-border bg-gradient-to-br from-purple/5 to-purple/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <Target className="h-5 w-5 text-purple mb-2" />
                        <p className="text-3xl font-bold">{goals.filter(g => g.status === "active").length}</p>
                        <p className="text-xs text-muted-foreground">Metas activas</p>
                    </motion.div>
                    
                    <motion.div 
                        className="p-4 rounded-2xl border border-border bg-gradient-to-br from-mint/5 to-mint/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <CheckCircle2 className="h-5 w-5 text-mint mb-2" />
                        <p className="text-3xl font-bold">{completedTasks}</p>
                        <p className="text-xs text-muted-foreground">Completadas</p>
                    </motion.div>
                    
                    <motion.div 
                        className="p-4 rounded-2xl border border-border bg-gradient-to-br from-coral/5 to-coral/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Clock className="h-5 w-5 text-coral mb-2" />
                        <p className="text-3xl font-bold">{pendingTasks}</p>
                        <p className="text-xs text-muted-foreground">Pendientes</p>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div 
                    className="flex gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {(["active", "all", "completed"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                filter === f
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "bg-muted hover:bg-accent"
                            )}
                        >
                            {f === "active" ? "Activas" : f === "all" ? "Todas" : "Completadas"}
                        </button>
                    ))}
                </motion.div>

                {/* Goals List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredGoals.map((goal, goalIndex) => {
                            const isExpanded = expandedGoals.includes(goal.id);
                            const daysRemaining = getDaysRemaining(goal.dueDate);
                            
                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: 0.35 + goalIndex * 0.05 }}
                                    className={cn(
                                        "rounded-2xl border bg-background overflow-hidden transition-all",
                                        isExpanded ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border"
                                    )}
                                >
                                    {/* Goal Header */}
                                    <button
                                        onClick={() => toggleGoal(goal.id)}
                                        className="w-full p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors text-left"
                                    >
                                        <motion.div 
                                            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl flex-shrink-0"
                                            style={{ backgroundColor: `${goal.color}15` }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {goal.progress === 100 ? (
                                                <Trophy className="h-7 w-7" style={{ color: goal.color }} />
                                            ) : (
                                                goal.spaceIcon
                                            )}
                                        </motion.div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold">{goal.title}</h3>
                                                {goal.progress === 100 && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-mint/20 text-mint font-medium flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3" />
                                                        Completado
                                                    </span>
                                                )}
                                                {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && goal.progress < 100 && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-coral/10 text-coral font-medium">
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
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold min-w-[3rem] text-right" style={{ color: goal.color }}>
                                                    {goal.progress}%
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        </motion.div>
                                    </button>

                                    {/* Objectives */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-border"
                                            >
                                                <div className="p-4 space-y-3">
                                                    {goal.objectives.map((objective, objIndex) => {
                                                        const isObjExpanded = expandedObjectives.includes(objective.id);
                                                        const objDaysRemaining = getDaysRemaining(objective.dueDate);
                                                        
                                                        return (
                                                            <motion.div 
                                                                key={objective.id}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: objIndex * 0.05 }}
                                                                className={cn(
                                                                    "rounded-xl border overflow-hidden transition-all",
                                                                    objective.progress === 100 ? "border-mint/30 bg-mint/5" : "border-border"
                                                                )}
                                                            >
                                                                {/* Objective Header */}
                                                                <button
                                                                    onClick={() => toggleObjective(objective.id)}
                                                                    className="w-full p-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
                                                                >
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            {objective.progress === 100 ? (
                                                                                <CheckCircle2 className="h-4 w-4 text-mint" />
                                                                            ) : (
                                                                                <Flag className="h-4 w-4" style={{ color: goal.color }} />
                                                                            )}
                                                                            <span className="font-medium text-sm">{objective.title}</span>
                                                                            {objDaysRemaining !== null && objDaysRemaining <= 5 && objDaysRemaining > 0 && objective.progress < 100 && (
                                                                                <span className="text-xs text-coral">
                                                                                    ({objDaysRemaining}d)
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px]">
                                                                                <motion.div
                                                                                    className="h-full rounded-full"
                                                                                    style={{ backgroundColor: objective.progress === 100 ? "#4ECDC4" : goal.color }}
                                                                                    animate={{ width: `${objective.progress}%` }}
                                                                                    transition={{ duration: 0.3 }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {objective.tasks.filter(t => t.completed).length}/{objective.tasks.length}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <motion.div
                                                                        animate={{ rotate: isObjExpanded ? 90 : 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                    >
                                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                    </motion.div>
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
                                                                                {objective.tasks.map((task, taskIndex) => (
                                                                                    <motion.button
                                                                                        key={task.id}
                                                                                        initial={{ opacity: 0, x: -10 }}
                                                                                        animate={{ opacity: 1, x: 0 }}
                                                                                        transition={{ delay: taskIndex * 0.03 }}
                                                                                        onClick={() => toggleTask(goal.id, objective.id, task.id)}
                                                                                        className={cn(
                                                                                            "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all",
                                                                                            "hover:bg-background",
                                                                                            task.completed && "opacity-60"
                                                                                        )}
                                                                                    >
                                                                                        <motion.div
                                                                                            animate={celebratingTask === task.id ? { 
                                                                                                scale: [1, 1.5, 1],
                                                                                                rotate: [0, 10, -10, 0]
                                                                                            } : {}}
                                                                                            transition={{ duration: 0.4 }}
                                                                                        >
                                                                                            {task.completed ? (
                                                                                                <CheckCircle2 
                                                                                                    className="h-5 w-5 flex-shrink-0 text-mint" 
                                                                                                />
                                                                                            ) : (
                                                                                                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 hover:text-primary transition-colors" />
                                                                                            )}
                                                                                        </motion.div>
                                                                                        <span className={cn(
                                                                                            "text-sm transition-all",
                                                                                            task.completed && "line-through text-muted-foreground"
                                                                                        )}>
                                                                                            {task.title}
                                                                                        </span>
                                                                                    </motion.button>
                                                                                ))}
                                                                                
                                                                                <button className="w-full flex items-center gap-3 p-2 rounded-lg text-left text-muted-foreground hover:text-foreground hover:bg-background transition-colors">
                                                                                    <Plus className="h-5 w-5" />
                                                                                    <span className="text-sm">Agregar tarea</span>
                                                                                </button>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        );
                                                    })}
                                                    
                                                    <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 transition-all">
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
                    <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No hay metas {filter === "completed" ? "completadas" : "activas"}</p>
                        <button className="mt-4 btn-primary">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear primera meta
                        </button>
                    </motion.div>
                )}
            </div>
        </MainLayout>
    );
}
