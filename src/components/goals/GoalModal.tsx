"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Plus, Trash2, Calendar, Flag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task { id: string; title: string; completed: boolean; }
interface Objective { id: string; title: string; progress: number; tasks: Task[]; dueDate?: string; }
interface Goal { id: string; title: string; description: string; space: string; spaceIcon: string; color: string; progress: number; objectives: Objective[]; dueDate?: string; status: "active" | "completed" | "paused"; }
interface GoalModalProps { isOpen: boolean; onClose: () => void; onSave: (goal: Goal) => void; goal?: Goal | null; spaces: { id: string; name: string; icon: string; color: string }[]; }

const colorOptions = [
    { name: "Azul", value: "#4F6BFF" },
    { name: "Violeta", value: "#8B5CF6" },
    { name: "Verde", value: "#10B981" },
    { name: "Coral", value: "#FF6B6B" },
    { name: "Amarillo", value: "#F59E0B" },
    { name: "Rosa", value: "#EC4899" },
    { name: "Cyan", value: "#06B6D4" },
];

export function GoalModal({ isOpen, onClose, onSave, goal, spaces }: GoalModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSpace, setSelectedSpace] = useState(spaces[0]?.id || "");
    const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
    const [dueDate, setDueDate] = useState("");
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [newObjectiveTitle, setNewObjectiveTitle] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (goal) {
                setTitle(goal.title); setDescription(goal.description); setSelectedSpace(goal.space); setSelectedColor(goal.color); setDueDate(goal.dueDate || ""); setObjectives(goal.objectives);
            } else {
                setTitle(""); setDescription(""); setSelectedSpace(spaces[0]?.id || ""); setSelectedColor(colorOptions[0].value); setDueDate(""); setObjectives([]);
            }
            setNewObjectiveTitle("");
        }
    }, [isOpen, goal, spaces]);

    const handleAddObjective = () => {
        if (!newObjectiveTitle.trim()) return;
        setObjectives([...objectives, { id: `obj-${Date.now()}`, title: newObjectiveTitle, progress: 0, tasks: [] }]);
        setNewObjectiveTitle("");
    };

    const handleRemoveObjective = (id: string) => setObjectives(objectives.filter(obj => obj.id !== id));

    const handleAddTask = (objectiveId: string, taskTitle: string) => {
        if (!taskTitle.trim()) return;
        setObjectives(objectives.map(obj => obj.id === objectiveId ? { ...obj, tasks: [...obj.tasks, { id: `task-${Date.now()}`, title: taskTitle, completed: false }] } : obj));
    };

    const handleRemoveTask = (objectiveId: string, taskId: string) => {
        setObjectives(objectives.map(obj => obj.id === objectiveId ? { ...obj, tasks: obj.tasks.filter(t => t.id !== taskId) } : obj));
    };

    const handleSave = () => {
        if (!title.trim()) return;
        const selectedSpaceData = spaces.find(s => s.id === selectedSpace);
        onSave({ id: goal?.id || `goal-${Date.now()}`, title, description, space: selectedSpace, spaceIcon: selectedSpaceData?.icon || "🎯", color: selectedColor, progress: 0, objectives, dueDate: dueDate || undefined, status: "active" });
        onClose();
    };

    const selectedSpaceData = spaces.find(s => s.id === selectedSpace);
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-2 sm:inset-auto sm:top-[5%] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="h-full sm:h-auto rounded-2xl border border-border bg-background shadow-2xl flex flex-col max-h-full sm:max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex-shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1.5 sm:p-2 rounded-xl flex-shrink-0" style={{ backgroundColor: `${selectedColor}20` }}>
                                <Target className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: selectedColor }} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold text-sm sm:text-base">{goal ? "Editar meta" : "Nueva meta"}</h2>
                                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Define tu meta y sus objetivos</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"><X className="h-5 w-5" /></button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Título de la meta *</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Lanzar el MVP" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base" />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Descripción</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Qué querés lograr?" rows={2} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm sm:text-base" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Espacio</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {spaces.map(space => (
                                            <button key={space.id} onClick={() => setSelectedSpace(space.id)} className={cn("flex items-center gap-2 p-2 sm:p-3 rounded-xl border-2 transition-all text-left", selectedSpace === space.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50")}>
                                                <span className="text-base sm:text-lg">{space.icon}</span>
                                                <span className="text-xs sm:text-sm font-medium truncate">{space.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Fecha límite</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colorOptions.map(color => (
                                        <button key={color.value} onClick={() => setSelectedColor(color.value)} className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all", selectedColor === color.value ? "ring-2 ring-offset-2 ring-offset-background ring-current" : "hover:scale-110")} style={{ backgroundColor: color.value }} title={color.name} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Objectives */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium flex items-center gap-2"><Flag className="h-4 w-4" style={{ color: selectedColor }} />Objetivos</label>
                                <span className="text-xs text-muted-foreground">{objectives.length} objetivo{objectives.length !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="space-y-3">
                                {objectives.map((objective, index) => (
                                    <motion.div key={objective.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 sm:p-4 rounded-xl border border-border bg-muted/30">
                                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted flex-shrink-0">#{index + 1}</span>
                                                <span className="font-medium text-sm truncate">{objective.title}</span>
                                            </div>
                                            <button onClick={() => handleRemoveObjective(objective.id)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-coral transition-colors flex-shrink-0"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                        <div className="space-y-1 mb-2">
                                            {objective.tasks.map(task => (
                                                <div key={task.id} className="flex items-center gap-2 text-sm pl-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                                                    <span className="flex-1 truncate">{task.title}</span>
                                                    <button onClick={() => handleRemoveTask(objective.id, task.id)} className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-coral transition-colors"><X className="h-3 w-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <input type="text" placeholder="Agregar tarea..." className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" onKeyDown={(e) => { if (e.key === "Enter") { handleAddTask(objective.id, e.currentTarget.value); e.currentTarget.value = ""; }}} />
                                    </motion.div>
                                ))}
                                <div className="flex gap-2">
                                    <input type="text" value={newObjectiveTitle} onChange={(e) => setNewObjectiveTitle(e.target.value)} placeholder="Nuevo objetivo..." className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-dashed border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" onKeyDown={(e) => { if (e.key === "Enter") handleAddObjective(); }} />
                                    <button onClick={handleAddObjective} disabled={!newObjectiveTitle.trim()} className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="h-5 w-5" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        {title && (
                            <div className="p-3 sm:p-4 rounded-xl border border-border bg-muted/20">
                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Sparkles className="h-3 w-3" />Vista previa</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl text-lg sm:text-xl flex-shrink-0" style={{ backgroundColor: `${selectedColor}15` }}>{selectedSpaceData?.icon || "🎯"}</div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm sm:text-base truncate">{title}</h4>
                                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{description || "Sin descripción"}</p>
                                    </div>
                                    <div className="w-1 h-8 sm:h-10 rounded-full flex-shrink-0" style={{ backgroundColor: selectedColor }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/30 flex-shrink-0">
                        <p className="text-xs text-muted-foreground hidden sm:block">* Campo requerido</p>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors text-sm">Cancelar</button>
                            <button onClick={handleSave} disabled={!title.trim()} className="flex-1 sm:flex-none btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm">{goal ? "Guardar" : "Crear meta"}</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
