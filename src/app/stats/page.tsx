"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle2, Target, Flame, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const weekData = [
    { day: "Lun", tasks: 5, focus: 2.5, pomodoros: 6 },
    { day: "Mar", tasks: 8, focus: 3.5, pomodoros: 8 },
    { day: "Mie", tasks: 3, focus: 1.5, pomodoros: 4 },
    { day: "Jue", tasks: 6, focus: 2.0, pomodoros: 5 },
    { day: "Vie", tasks: 7, focus: 3.0, pomodoros: 7 },
    { day: "Sab", tasks: 2, focus: 1.0, pomodoros: 2 },
    { day: "Dom", tasks: 4, focus: 2.0, pomodoros: 4 },
];

const spaceData = [
    { name: "Aidaptive", tasks: 12, hours: 8.5, color: "#4F6BFF", icon: "🤖" },
    { name: "Limbo", tasks: 8, hours: 5.0, color: "#8B5CF6", icon: "🚀" },
    { name: "iGreen", tasks: 5, hours: 2.5, color: "#10B981", icon: "🌱" },
    { name: "Personal", tasks: 10, hours: 4.0, color: "#F59E0B", icon: "👤" },
];

const weeklyGoals = [
    { id: "1", title: "Completar 30 tareas", current: 25, target: 30, icon: CheckCircle2 },
    { id: "2", title: "15 horas de enfoque", current: 12, target: 15, icon: Clock },
    { id: "3", title: "Avanzar Limbo a 60%", current: 45, target: 60, icon: Target },
];

const achievements = [
    { id: "1", title: "Racha de 5 días", description: "Completaste tareas 5 días seguidos", icon: "🔥", earned: true },
    { id: "2", title: "Madrugador", description: "Completaste una tarea antes de las 8am", icon: "🌅", earned: true },
    { id: "3", title: "Productividad máxima", description: "10+ tareas en un día", icon: "⚡", earned: false },
    { id: "4", title: "Enfoque zen", description: "4 pomodoros sin interrupción", icon: "🧘", earned: true },
];

export default function StatsPage() {
    const [weekOffset, setWeekOffset] = useState(0);

    const totalTasks = weekData.reduce((acc, d) => acc + d.tasks, 0);
    const totalFocus = weekData.reduce((acc, d) => acc + d.focus, 0);
    const totalPomodoros = weekData.reduce((acc, d) => acc + d.pomodoros, 0);
    const avgTasksPerDay = (totalTasks / 7).toFixed(1);

    const thisWeekTasks = totalTasks;
    const lastWeekTasks = 28;
    const taskChange = ((thisWeekTasks - lastWeekTasks) / lastWeekTasks * 100).toFixed(0);
    const isPositive = Number(taskChange) >= 0;

    const getWeekLabel = () => {
        if (weekOffset === 0) return "Esta semana";
        if (weekOffset === -1) return "Semana pasada";
        return `Hace ${Math.abs(weekOffset)} semanas`;
    };

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-3"><BarChart3 className="h-6 w-6 sm:h-7 sm:w-7" />Progreso semanal</h1>
                        <p className="text-muted-foreground text-sm">Mirá tu productividad y seguí tu progreso</p>
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-end">
                        <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-2 rounded-xl hover:bg-accent"><ChevronLeft className="h-5 w-5" /></button>
                        <span className="px-3 sm:px-4 py-2 rounded-xl bg-muted text-xs sm:text-sm font-medium min-w-[120px] sm:min-w-[140px] text-center">{getWeekLabel()}</span>
                        <button onClick={() => setWeekOffset(prev => Math.min(prev + 1, 0))} disabled={weekOffset === 0} className={cn("p-2 rounded-xl hover:bg-accent", weekOffset === 0 && "opacity-50 cursor-not-allowed")}><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </motion.div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-mint/5 to-mint/10">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-mint" />
                            <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-mint" : "text-coral")}>
                                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{taskChange}%
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold">{totalTasks}</p>
                        <p className="text-xs text-muted-foreground">Tareas completadas</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2" />
                        <p className="text-2xl sm:text-3xl font-bold">{totalFocus}h</p>
                        <p className="text-xs text-muted-foreground">Tiempo enfocado</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-purple/5 to-purple/10">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple mb-2" />
                        <p className="text-2xl sm:text-3xl font-bold">{totalPomodoros}</p>
                        <p className="text-xs text-muted-foreground">Pomodoros</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-3 sm:p-4 rounded-2xl border border-border bg-gradient-to-br from-coral/5 to-coral/10">
                        <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-coral mb-2" />
                        <p className="text-2xl sm:text-3xl font-bold">{avgTasksPerDay}</p>
                        <p className="text-xs text-muted-foreground">Promedio diario</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Main chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 p-4 sm:p-6 rounded-2xl border border-border bg-background">
                        <h3 className="font-semibold mb-4 text-sm sm:text-base">Actividad diaria</h3>
                        <div className="h-48 sm:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weekData}>
                                    <defs>
                                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F6BFF" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4F6BFF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                                    <XAxis dataKey="day" stroke="#888" fontSize={10} tickMargin={5} />
                                    <YAxis stroke="#888" fontSize={10} width={30} />
                                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
                                    <Area type="monotone" dataKey="tasks" stroke="#4F6BFF" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" name="Tareas" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Weekly goals */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="p-4 sm:p-6 rounded-2xl border border-border bg-background">
                        <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base"><Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />Objetivos semanales</h3>
                        <div className="space-y-4">
                            {weeklyGoals.map((goal) => {
                                const progress = Math.min((goal.current / goal.target) * 100, 100);
                                const Icon = goal.icon;
                                return (
                                    <div key={goal.id}>
                                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="truncate">{goal.title}</span>
                                            </div>
                                            <span className="text-muted-foreground flex-shrink-0 ml-2">{goal.current}/{goal.target}</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div className={cn("h-full rounded-full", progress >= 100 ? "bg-mint" : "bg-primary")} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, delay: 0.4 }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Time per space */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-4 sm:p-6 rounded-2xl border border-border bg-background">
                        <h3 className="font-semibold mb-4 text-sm sm:text-base">Tiempo por espacio</h3>
                        <div className="h-40 sm:h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={spaceData} layout="vertical">
                                    <XAxis type="number" stroke="#888" fontSize={10} />
                                    <YAxis type="category" dataKey="name" stroke="#888" fontSize={10} width={70} />
                                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} formatter={(value: number) => [`${value}h`, "Horas"]} />
                                    <Bar dataKey="hours" fill="#4F6BFF" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {spaceData.map((space) => (
                                <div key={space.name} className="flex items-center gap-2 text-xs sm:text-sm">
                                    <span>{space.icon}</span>
                                    <span className="text-muted-foreground">{space.tasks} tareas</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Achievements */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="p-4 sm:p-6 rounded-2xl border border-border bg-background">
                        <h3 className="font-semibold mb-4 text-sm sm:text-base">Logros</h3>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className={cn("p-2 sm:p-3 rounded-xl border transition-colors", achievement.earned ? "border-yellow-500/30 bg-yellow-500/5" : "border-border bg-muted/30 opacity-50")}>
                                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{achievement.icon}</div>
                                    <p className="font-medium text-xs sm:text-sm">{achievement.title}</p>
                                    <p className="text-xs text-muted-foreground hidden sm:block">{achievement.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
