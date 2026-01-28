"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Clock, Calendar, Inbox, FolderOpen, ArrowRight, CheckCircle2, Circle, Plus, Target, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useSpaces } from "@/hooks/useSpaces";
import { useCaptures } from "@/hooks/useCaptures";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";

function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        let start = 0;
        const increment = value / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) { setDisplayValue(value); clearInterval(timer); }
            else setDisplayValue(Math.floor(start));
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <span>{displayValue}</span>;
}

function ProgressRing({ progress, size = 44, strokeWidth = 4, color = "#4F6BFF" }: { progress: number; size?: number; strokeWidth?: number; color?: string }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle stroke="currentColor" className="text-muted/30" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
            <motion.circle stroke={color} fill="transparent" strokeWidth={strokeWidth} strokeLinecap="round" r={radius} cx={size / 2} cy={size / 2} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: "easeOut" }} style={{ strokeDasharray: circumference }} />
        </svg>
    );
}

export default function Home() {
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");
    
    const { profile } = useProfile();
    const { spaces } = useSpaces();
    const { unprocessedCount } = useCaptures();
    const { activeGoals } = useGoals();
    const { tasks, toggleTask } = useTasks();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }));
            const hour = now.getHours();
            if (hour < 12) setGreeting("Buenos días");
            else if (hour < 18) setGreeting("Buenas tardes");
            else setGreeting("Buenas noches");
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleTask = async (id: string) => {
        await toggleTask(id);
    };

    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter(t => !t.due_date || t.due_date === today);
    const completedTasks = todayTasks.filter(t => t.completed).length;
    const taskProgress = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;
    
    const goalsProgress = activeGoals.length > 0 
        ? Math.round(activeGoals.reduce((acc, g) => acc + (g.progress || 0), 0) / activeGoals.length)
        : 0;

    const userName = profile?.name?.split(" ")[0] || "Usuario";

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                <motion.div className="mb-5 sm:mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-muted-foreground flex items-center gap-2 mb-1 text-xs sm:text-sm">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {currentTime} · {new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        {greeting}, <span className="text-gradient">{userName}</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Link href="/capture" className="block p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all group">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <Inbox className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                {unprocessedCount > 0 && <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">Nuevo</span>}
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold"><AnimatedNumber value={unprocessedCount} /></p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">En captura</p>
                            <ArrowRight className="h-4 w-4 text-primary mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-mint/5 to-mint/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-mint mb-1 sm:mb-2" />
                                <p className="text-2xl sm:text-3xl font-bold">{completedTasks}/{todayTasks.length}</p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Tareas hoy</p>
                            </div>
                            <ProgressRing progress={taskProgress} size={36} color="#4ECDC4" />
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-purple/5 to-purple/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple mb-1 sm:mb-2" />
                                <p className="text-2xl sm:text-3xl font-bold"><AnimatedNumber value={spaces.length} /></p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Espacios</p>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 sm:gap-1">
                                {spaces.slice(0, 3).map(s => (<span key={s.id} className="text-base sm:text-lg">{s.icon}</span>))}
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <Link href="/goals" className="block p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-coral/5 to-coral/10 hover:from-coral/10 hover:to-coral/20 transition-all group">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-coral" />
                                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-coral">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{goalsProgress}%</span>
                                </div>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{activeGoals.length}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Metas activas</p>
                            <ArrowRight className="h-4 w-4 text-coral mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base"><FolderOpen className="h-4 w-4 sm:h-5 sm:w-5" />Espacios</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {spaces.map((space, index) => (
                                <motion.div key={space.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.05 }}>
                                    <Link href={`/spaces/${space.id}`} className="block p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl text-lg sm:text-2xl flex-shrink-0" style={{ backgroundColor: `${space.color}15` }}>{space.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm sm:text-base font-medium group-hover:text-primary transition-colors line-clamp-1">{space.name}</p>
                                                <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2">{space.description || "Sin descripción"}</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                            {spaces.length === 0 && (
                                <div className="col-span-1 sm:col-span-2 text-center py-8 text-muted-foreground">
                                    <p>No hay espacios creados</p>
                                    <p className="text-sm">Crea uno desde el sidebar</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base"><Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />Hoy</h2>
                                <Link href="/goals" className="p-1 rounded-lg hover:bg-accent transition-colors"><Plus className="h-4 w-4" /></Link>
                            </div>
                            
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {todayTasks.slice(0, 5).map((task) => {
                                        const space = spaces.find(s => s.id === task.space_id);
                                        return (
                                            <motion.button key={task.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8, x: 100 }} onClick={() => handleToggleTask(task.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-accent/50 transition-all text-left", task.completed && "opacity-60 bg-muted/30")}>
                                                <motion.div animate={task.completed ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                                                    {task.completed ? <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 hover:text-primary transition-colors" />}
                                                </motion.div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn("text-sm truncate transition-all", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                                                    {space && <p className="text-xs text-muted-foreground flex items-center gap-1"><span>{space.icon}</span>{space.name}</p>}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </AnimatePresence>
                                {todayTasks.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        <p>No hay tareas para hoy</p>
                                        <Link href="/goals" className="text-primary hover:underline">Crear una tarea</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base"><Target className="h-4 w-4 sm:h-5 sm:w-5" />Metas</h2>
                                <Link href="/goals" className="text-xs text-primary hover:underline">Ver todas</Link>
                            </div>
                            
                            <div className="space-y-2">
                                {activeGoals.slice(0, 3).map((goal, index) => {
                                    const space = spaces.find(s => s.id === goal.space_id);
                                    return (
                                        <motion.div key={goal.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }}>
                                            <Link href="/goals" className="block p-3 rounded-xl border border-border bg-background hover:border-primary/20 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{space?.icon || "🎯"}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{goal.title}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full rounded-full" style={{ width: `${goal.progress || 0}%`, backgroundColor: goal.color || "#4F6BFF" }} />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{goal.progress || 0}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                {activeGoals.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        <p>No hay metas activas</p>
                                        <Link href="/goals" className="text-primary hover:underline">Crear una meta</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
