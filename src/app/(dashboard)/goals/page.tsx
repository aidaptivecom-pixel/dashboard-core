"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Target, Plus, ChevronDown, CheckCircle2, TrendingUp, Clock, Sparkles, Trophy, Edit3, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGoals } from "@/hooks/useGoals";
import { useSpaces } from "@/hooks/useSpaces";

function ProgressRing({ progress, size = 60, strokeWidth = 5, color = "#4F6BFF" }: { progress: number; size?: number; strokeWidth?: number; color?: string }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle stroke="currentColor" className="text-muted/30" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
                <motion.circle stroke={color} fill="transparent" strokeWidth={strokeWidth} strokeLinecap="round" r={radius} cx={size / 2} cy={size / 2} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: "easeOut" }} style={{ strokeDasharray: circumference }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold">{progress}%</span></div>
        </div>
    );
}

const colorOptions = [
    { name: "Azul", value: "#4F6BFF" },
    { name: "Verde", value: "#10B981" },
    { name: "Violeta", value: "#8B5CF6" },
    { name: "Amarillo", value: "#F59E0B" },
    { name: "Coral", value: "#FF6B6B" },
];

export default function GoalsPage() {
    const { goals, loading, createGoal, updateGoal, deleteGoal } = useGoals();
    const { spaces } = useSpaces();
    const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
    const [filter, setFilter] = useState<"all" | "active" | "completed">("active");
    const [showModal, setShowModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<any>(null);
    const [formData, setFormData] = useState({ title: "", description: "", space_id: "", color: "#4F6BFF", due_date: "" });

    const toggleGoal = (id: string) => setExpandedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    
    const triggerCelebration = () => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    const handleOpenCreate = () => {
        setEditingGoal(null);
        setFormData({ title: "", description: "", space_id: spaces[0]?.id || "", color: "#4F6BFF", due_date: "" });
        setShowModal(true);
    };

    const handleOpenEdit = (goal: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingGoal(goal);
        setFormData({
            title: goal.title,
            description: goal.description || "",
            space_id: goal.space_id || "",
            color: goal.color || "#4F6BFF",
            due_date: goal.due_date || "",
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;
        
        if (editingGoal) {
            await updateGoal(editingGoal.id, formData);
        } else {
            await createGoal(formData);
        }
        setShowModal(false);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("¿Eliminar esta meta?")) {
            await deleteGoal(id);
        }
    };

    const handleToggleComplete = async (goal: any, e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = goal.status === "completed" ? "active" : "completed";
        const newProgress = newStatus === "completed" ? 100 : goal.progress;
        
        if (newStatus === "completed") triggerCelebration();
        
        await updateGoal(goal.id, { status: newStatus, progress: newProgress });
    };

    const filteredGoals = goals.filter(g => {
        if (filter === "all") return true;
        if (filter === "active") return g.status === "active";
        return g.status === "completed";
    });

    const totalProgress = Math.round(filteredGoals.reduce((acc, g) => acc + (g.progress || 0), 0) / (filteredGoals.length || 1));
    const activeCount = goals.filter(g => g.status === "active").length;
    const completedCount = goals.filter(g => g.status === "completed").length;

    const getDaysRemaining = (date?: string | null) => {
        if (!date) return null;
        const diff = new Date(date).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const getSpaceForGoal = (spaceId: string | null) => spaces.find(s => s.id === spaceId);

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3"><Target className="h-7 w-7" />Objetivos</h1>
                        <p className="text-muted-foreground">Define y sigue tus metas</p>
                    </div>
                    <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />Nueva meta</button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <motion.div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="flex items-center justify-between">
                            <div><TrendingUp className="h-5 w-5 text-primary mb-2" /><p className="text-xs text-muted-foreground">Progreso</p></div>
                            <ProgressRing progress={totalProgress} size={50} color="#4F6BFF" />
                        </div>
                    </motion.div>
                    <motion.div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-purple/5 to-purple/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <Target className="h-5 w-5 text-purple mb-2" />
                        <p className="text-3xl font-bold">{activeCount}</p>
                        <p className="text-xs text-muted-foreground">Activas</p>
                    </motion.div>
                    <motion.div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-mint/5 to-mint/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <CheckCircle2 className="h-5 w-5 text-mint mb-2" />
                        <p className="text-3xl font-bold">{completedCount}</p>
                        <p className="text-xs text-muted-foreground">Completadas</p>
                    </motion.div>
                    <motion.div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-coral/5 to-coral/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <Clock className="h-5 w-5 text-coral mb-2" />
                        <p className="text-3xl font-bold">{goals.length}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div className="flex gap-2 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    {(["active", "all", "completed"] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all", filter === f ? "bg-primary text-white" : "bg-muted hover:bg-accent")}>
                            {f === "active" ? "Activas" : f === "all" ? "Todas" : "Completadas"}
                        </button>
                    ))}
                </motion.div>

                {/* Goals List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12"><p className="text-muted-foreground">Cargando...</p></div>
                    ) : (
                        <AnimatePresence>
                            {filteredGoals.map((goal, index) => {
                                const isExpanded = expandedGoals.includes(goal.id);
                                const daysRemaining = getDaysRemaining(goal.due_date);
                                const space = getSpaceForGoal(goal.space_id);
                                const progress = goal.progress || 0;
                                const color = goal.color || "#4F6BFF";

                                return (
                                    <motion.div
                                        key={goal.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={cn("rounded-2xl border bg-background overflow-hidden transition-all", isExpanded ? "border-primary/30 shadow-lg" : "border-border")}
                                    >
                                        <div className="flex items-center">
                                            <button onClick={() => toggleGoal(goal.id)} className="flex-1 p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors text-left">
                                                <motion.div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl flex-shrink-0" style={{ backgroundColor: `${color}15` }} whileHover={{ scale: 1.05 }}>
                                                    {goal.status === "completed" ? <Trophy className="h-7 w-7" style={{ color }} /> : space?.icon || "🎯"}
                                                </motion.div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-semibold">{goal.title}</h3>
                                                        {goal.status === "completed" && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-mint/20 text-mint font-medium flex items-center gap-1">
                                                                <Sparkles className="h-3 w-3" />Completado
                                                            </span>
                                                        )}
                                                        {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && goal.status !== "completed" && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-coral/10 text-coral font-medium">{daysRemaining} días</span>
                                                        )}
                                                    </div>
                                                    {goal.description && <p className="text-sm text-muted-foreground truncate">{goal.description}</p>}
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                                                        </div>
                                                        <span className="text-sm font-bold min-w-[3rem] text-right" style={{ color }}>{progress}%</span>
                                                    </div>
                                                </div>
                                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><ChevronDown className="h-5 w-5 text-muted-foreground" /></motion.div>
                                            </button>
                                            <div className="flex items-center border-l border-border">
                                                <button onClick={(e) => handleToggleComplete(goal, e)} className="p-4 hover:bg-accent/50 transition-colors" title={goal.status === "completed" ? "Reactivar" : "Completar"}>
                                                    <CheckCircle2 className={cn("h-5 w-5", goal.status === "completed" ? "text-mint" : "text-muted-foreground hover:text-mint")} />
                                                </button>
                                                <button onClick={(e) => handleOpenEdit(goal, e)} className="p-4 hover:bg-accent/50 transition-colors" title="Editar">
                                                    <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                </button>
                                                <button onClick={(e) => handleDelete(goal.id, e)} className="p-4 hover:bg-coral/10 transition-colors" title="Eliminar">
                                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-coral" />
                                                </button>
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="border-t border-border overflow-hidden">
                                                    <div className="p-4 space-y-3">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            {space && (
                                                                <span className="flex items-center gap-2">
                                                                    <span>{space.icon}</span>
                                                                    <span className="text-muted-foreground">{space.name}</span>
                                                                </span>
                                                            )}
                                                            {goal.due_date && (
                                                                <span className="flex items-center gap-2 text-muted-foreground">
                                                                    <Clock className="h-4 w-4" />
                                                                    {new Date(goal.due_date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {goal.description && (
                                                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl">{goal.description}</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground italic">Los objetivos y tareas se agregarán próximamente</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}

                    {!loading && filteredGoals.length === 0 && (
                        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No hay metas {filter === "completed" ? "completadas" : "activas"}</p>
                            <button onClick={handleOpenCreate} className="mt-4 btn-primary"><Plus className="h-4 w-4 mr-2" />Crear primera meta</button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-x-4 top-[10%] sm:inset-auto sm:top-[15%] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50">
                            <div className="bg-background rounded-2xl border border-border shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">{editingGoal ? "Editar meta" : "Nueva meta"}</h3>
                                    <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-accent"><X className="h-5 w-5" /></button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Título *</label>
                                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ej: Lanzar MVP" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" autoFocus />
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Descripción</label>
                                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="¿Qué querés lograr?" rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Espacio</label>
                                            <select value={formData.space_id} onChange={(e) => setFormData({ ...formData, space_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                                                <option value="">Sin espacio</option>
                                                {spaces.map(space => (
                                                    <option key={space.id} value={space.id}>{space.icon} {space.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Fecha límite</label>
                                            <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Color</label>
                                        <div className="flex gap-2">
                                            {colorOptions.map(color => (
                                                <button key={color.value} onClick={() => setFormData({ ...formData, color: color.value })} className={cn("w-8 h-8 rounded-full transition-all", formData.color === color.value ? "ring-2 ring-offset-2 ring-offset-background" : "hover:scale-110")} style={{ backgroundColor: color.value }} title={color.name} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors">Cancelar</button>
                                    <button onClick={handleSave} disabled={!formData.title.trim()} className="flex-1 btn-primary disabled:opacity-50">{editingGoal ? "Guardar" : "Crear meta"}</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
