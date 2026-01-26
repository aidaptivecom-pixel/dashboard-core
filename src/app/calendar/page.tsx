"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Phone,
    Video,
    AlertCircle,
    Circle,
    MoreHorizontal,
    List,
    Grid3X3,
    CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "month" | "week" | "agenda";

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time?: string;
    endTime?: string;
    type: "task" | "meeting" | "call" | "deadline" | "reminder";
    space?: string;
    spaceIcon?: string;
    completed?: boolean;
    color?: string;
}

const spaces = [
    { id: "aidaptive", name: "Aidaptive", icon: "🤖", color: "#4F6BFF" },
    { id: "igreen", name: "iGreen", icon: "🌱", color: "#10B981" },
    { id: "limbo", name: "Limbo", icon: "🚀", color: "#8B5CF6" },
    { id: "personal", name: "Personal", icon: "👤", color: "#F59E0B" },
];

const generateMockEvents = (): CalendarEvent[] => {
    const today = new Date();
    return [
        { id: "1", title: "Daily Standup", date: today, time: "10:00", endTime: "10:30", type: "meeting", space: "aidaptive", spaceIcon: "🤖", color: "#4F6BFF" },
        { id: "2", title: "Revisar propuesta cliente ABC", date: today, type: "task", space: "aidaptive", spaceIcon: "🤖", color: "#4F6BFF" },
        { id: "3", title: "Call con inversores", date: today, time: "14:00", endTime: "15:00", type: "call", space: "limbo", spaceIcon: "🚀", color: "#8B5CF6" },
        { id: "4", title: "Deadline: Entregar diseños", date: today, type: "deadline", space: "limbo", spaceIcon: "🚀", color: "#8B5CF6" },
        { id: "5", title: "Llamar proveedor macetas", date: new Date(today.getTime() + 24 * 60 * 60 * 1000), time: "11:00", type: "call", space: "igreen", spaceIcon: "🌱", color: "#10B981" },
        { id: "6", title: "Pagar facturas", date: new Date(today.getTime() + 24 * 60 * 60 * 1000), type: "task", space: "personal", spaceIcon: "👤", color: "#F59E0B" },
        { id: "7", title: "Review código CRM", date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), time: "16:00", endTime: "17:00", type: "meeting", space: "aidaptive", spaceIcon: "🤖", color: "#4F6BFF" },
        { id: "8", title: "Dentista", date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), time: "09:00", type: "reminder", space: "personal", spaceIcon: "👤", color: "#F59E0B" },
        { id: "9", title: "Terminar landing page", date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), type: "deadline", space: "limbo", spaceIcon: "🚀", color: "#8B5CF6" },
        { id: "10", title: "Sesión fotos productos", date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), time: "10:00", endTime: "13:00", type: "task", space: "igreen", spaceIcon: "🌱", color: "#10B981" },
        { id: "11", title: "Planificación semanal", date: new Date(today.getTime() - 24 * 60 * 60 * 1000), time: "09:00", endTime: "09:30", type: "meeting", space: "personal", spaceIcon: "👤", color: "#F59E0B" },
        { id: "12", title: "Deploy nuevo feature", date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), time: "15:00", type: "task", space: "aidaptive", spaceIcon: "🤖", color: "#4F6BFF" },
    ];
};

const typeConfig = {
    task: { icon: Circle, label: "Tarea" },
    meeting: { icon: Video, label: "Reunión" },
    call: { icon: Phone, label: "Llamada" },
    deadline: { icon: AlertCircle, label: "Deadline" },
    reminder: { icon: Clock, label: "Recordatorio" },
};

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [events] = useState(generateMockEvents());
    const [spaceFilter, setSpaceFilter] = useState<string | null>(null);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        const days: (Date | null)[] = [];
        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const getWeekDays = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day;
        const weekStart = new Date(date);
        weekStart.setDate(diff);
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            const compareDate = new Date(date);
            compareDate.setHours(0, 0, 0, 0);
            const matchesDate = eventDate.getTime() === compareDate.getTime();
            const matchesSpace = !spaceFilter || event.space === spaceFilter;
            return matchesDate && matchesSpace;
        });
    };

    const navigateMonth = (direction: number) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };
    const goToToday = () => { setCurrentDate(new Date()); setSelectedDate(new Date()); };
    const isToday = (date: Date) => { const t = new Date(); return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear(); };
    const isSelected = (date: Date) => date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();

    const selectedDateEvents = getEventsForDate(selectedDate);
    const days = getDaysInMonth(currentDate);
    const weekDays = getWeekDays(currentDate);

    const getUpcomingEvents = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return events.filter(e => { const eventDate = new Date(e.date); eventDate.setHours(0, 0, 0, 0); return eventDate >= now && (!spaceFilter || e.space === spaceFilter); }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 10);
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        if (d.toDateString() === today.toDateString()) return "Hoy";
        if (d.toDateString() === tomorrow.toDateString()) return "Mañana";
        return d.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
    };

    const getWeekRange = () => {
        const start = weekDays[0], end = weekDays[6];
        if (start.getMonth() === end.getMonth()) return `${start.getDate()} - ${end.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
        return `${start.getDate()} ${MONTHS[start.getMonth()].slice(0, 3)} - ${end.getDate()} ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
    };

    const getEventPosition = (time: string) => { const [hours, minutes] = time.split(":").map(Number); return ((hours - 7) * 60 + minutes) * (60 / 60); };
    const getEventHeight = (startTime: string, endTime?: string) => { if (!endTime) return 30; const [startH, startM] = startTime.split(":").map(Number); const [endH, endM] = endTime.split(":").map(Number); return Math.max((endH * 60 + endM) - (startH * 60 + startM), 30); };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <CalendarIcon className="h-7 w-7" />
                            Calendario
                        </h1>
                        <p className="text-muted-foreground text-sm">Tareas, reuniones y deadlines</p>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Nuevo evento
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 mb-6">
                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <button onClick={() => viewMode === "week" ? navigateWeek(-1) : navigateMonth(-1)} className="p-2 rounded-xl hover:bg-accent transition-colors">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <h2 className="text-base sm:text-lg font-semibold min-w-[140px] sm:min-w-[220px] text-center truncate">
                                {viewMode === "week" ? getWeekRange() : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                            </h2>
                            <button onClick={() => viewMode === "week" ? navigateWeek(1) : navigateMonth(1)} className="p-2 rounded-xl hover:bg-accent transition-colors">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                        <button onClick={goToToday} className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent transition-colors">Hoy</button>
                    </div>

                    {/* Filters row */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {/* Space Filter - scrollable on mobile */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted overflow-x-auto flex-shrink-0">
                            <button onClick={() => setSpaceFilter(null)} className={cn("px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap", !spaceFilter ? "bg-background shadow-sm" : "hover:bg-background/50")}>Todos</button>
                            {spaces.map(space => (
                                <button key={space.id} onClick={() => setSpaceFilter(spaceFilter === space.id ? null : space.id)} className={cn("px-2 py-1.5 rounded-lg text-sm transition-colors", spaceFilter === space.id ? "bg-background shadow-sm" : "hover:bg-background/50")} title={space.name}>{space.icon}</button>
                            ))}
                        </div>

                        {/* View Mode */}
                        <div className="flex border border-border rounded-xl overflow-hidden self-end sm:ml-auto flex-shrink-0">
                            <button onClick={() => setViewMode("month")} className={cn("p-2 transition-colors", viewMode === "month" ? "bg-accent" : "hover:bg-accent")} title="Vista mensual"><Grid3X3 className="h-4 w-4" /></button>
                            <button onClick={() => setViewMode("week")} className={cn("p-2 transition-colors", viewMode === "week" ? "bg-accent" : "hover:bg-accent")} title="Vista semanal"><CalendarDays className="h-4 w-4" /></button>
                            <button onClick={() => setViewMode("agenda")} className={cn("p-2 transition-colors", viewMode === "agenda" ? "bg-accent" : "hover:bg-accent")} title="Vista agenda"><List className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>

                {/* Month View */}
                {viewMode === "month" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-border bg-background overflow-hidden">
                                <div className="grid grid-cols-7 border-b border-border">
                                    {DAYS.map(day => (<div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-muted-foreground">{day}</div>))}
                                </div>
                                <div className="grid grid-cols-7">
                                    {days.map((date, index) => {
                                        if (!date) return <div key={`empty-${index}`} className="p-1 sm:p-2 min-h-[70px] sm:min-h-[100px] border-b border-r border-border bg-muted/30" />;
                                        const dayEvents = getEventsForDate(date);
                                        const isCurrentDay = isToday(date);
                                        const isSelectedDay = isSelected(date);
                                        return (
                                            <button key={date.toISOString()} onClick={() => setSelectedDate(date)} className={cn("p-1 sm:p-2 min-h-[70px] sm:min-h-[100px] border-b border-r border-border text-left transition-colors hover:bg-accent/50", isSelectedDay && "bg-primary/5", date.getMonth() !== currentDate.getMonth() && "opacity-40")}>
                                                <span className={cn("inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm", isCurrentDay && "bg-primary text-white font-bold", isSelectedDay && !isCurrentDay && "bg-primary/20 font-medium")}>{date.getDate()}</span>
                                                <div className="mt-1 space-y-0.5 sm:space-y-1 hidden sm:block">
                                                    {dayEvents.slice(0, 2).map(event => (
                                                        <div key={event.id} className="text-xs px-1 py-0.5 rounded truncate" style={{ backgroundColor: `${event.color}20`, color: event.color }}>
                                                            {event.time && <span className="font-mono mr-1">{event.time}</span>}{event.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && <div className="text-xs text-muted-foreground px-1">+{dayEvents.length - 2}</div>}
                                                </div>
                                                {dayEvents.length > 0 && <div className="sm:hidden flex gap-0.5 mt-1">{dayEvents.slice(0, 3).map(e => <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />)}</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Selected Day Events */}
                        <div>
                            <div className="rounded-2xl border border-border bg-background p-4">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full text-sm", isToday(selectedDate) && "bg-primary text-white")}>{selectedDate.getDate()}</span>
                                    <span className="truncate">{selectedDate.toLocaleDateString("es", { weekday: "long", month: "long" })}</span>
                                </h3>
                                {selectedDateEvents.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedDateEvents.map(event => {
                                            const TypeIcon = typeConfig[event.type].icon;
                                            return (
                                                <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors group">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${event.color}15` }}><TypeIcon className="h-4 w-4" style={{ color: event.color }} /></div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{event.title}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {event.time && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}{event.endTime && ` - ${event.endTime}`}</span>}
                                                                {event.spaceIcon && <span className="text-xs">{event.spaceIcon}</span>}
                                                            </div>
                                                        </div>
                                                        <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-all flex-shrink-0"><MoreHorizontal className="h-4 w-4" /></button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">No hay eventos</p>
                                        <button className="mt-3 text-sm text-primary hover:underline">+ Agregar evento</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Week View - Responsive */}
                {viewMode === "week" && (
                    <div className="rounded-2xl border border-border bg-background overflow-hidden">
                        {/* Mobile: Show as list */}
                        <div className="lg:hidden">
                            {weekDays.map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                return (
                                    <div key={index} className={cn("border-b border-border last:border-b-0", isToday(date) && "bg-primary/5")}>
                                        <div className="p-3 flex items-center justify-between border-b border-border bg-muted/30">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold", isToday(date) && "bg-primary text-white")}>{date.getDate()}</span>
                                                <span className="text-sm font-medium">{DAYS[index]}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{dayEvents.length} eventos</span>
                                        </div>
                                        {dayEvents.length > 0 ? (
                                            <div className="p-2 space-y-2">
                                                {dayEvents.map(event => (
                                                    <div key={event.id} className="p-2 rounded-lg text-sm" style={{ backgroundColor: `${event.color}15`, borderLeft: `3px solid ${event.color}` }}>
                                                        <p className="font-medium truncate" style={{ color: event.color }}>{event.title}</p>
                                                        {event.time && <p className="text-xs text-muted-foreground">{event.time}{event.endTime && ` - ${event.endTime}`}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-muted-foreground">Sin eventos</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop: Full grid */}
                        <div className="hidden lg:block">
                            <div className="grid grid-cols-8 border-b border-border">
                                <div className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border"><Clock className="h-4 w-4 mx-auto" /></div>
                                {weekDays.map((date, index) => (
                                    <div key={index} className={cn("p-3 text-center border-r border-border last:border-r-0", isToday(date) && "bg-primary/5")}>
                                        <p className="text-xs text-muted-foreground">{DAYS[index]}</p>
                                        <p className={cn("text-lg font-semibold mt-1", isToday(date) && "text-primary")}>{date.getDate()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="max-h-[600px] overflow-y-auto">
                                <div className="grid grid-cols-8">
                                    <div className="border-r border-border">
                                        {HOURS.map(hour => (<div key={hour} className="h-[60px] px-2 py-1 text-xs text-muted-foreground text-right border-b border-border">{hour.toString().padStart(2, "0")}:00</div>))}
                                    </div>
                                    {weekDays.map((date, dayIndex) => {
                                        const dayEvents = getEventsForDate(date).filter(e => e.time);
                                        const allDayEvents = getEventsForDate(date).filter(e => !e.time);
                                        return (
                                            <div key={dayIndex} className={cn("relative border-r border-border last:border-r-0", isToday(date) && "bg-primary/5")}>
                                                {allDayEvents.length > 0 && (
                                                    <div className="absolute top-0 left-0 right-0 p-1 z-10">
                                                        {allDayEvents.slice(0, 2).map(event => (<div key={event.id} className="text-xs px-1.5 py-0.5 rounded mb-1 truncate" style={{ backgroundColor: `${event.color}30`, color: event.color, borderLeft: `3px solid ${event.color}` }}>{event.title}</div>))}
                                                    </div>
                                                )}
                                                {HOURS.map(hour => (<div key={hour} className="h-[60px] border-b border-border hover:bg-accent/30 transition-colors cursor-pointer" />))}
                                                {dayEvents.map(event => {
                                                    if (!event.time) return null;
                                                    const top = getEventPosition(event.time);
                                                    const height = getEventHeight(event.time, event.endTime);
                                                    return (
                                                        <motion.div key={event.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute left-1 right-1 rounded-lg px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden" style={{ top: `${top}px`, height: `${height}px`, backgroundColor: `${event.color}20`, borderLeft: `3px solid ${event.color}` }}>
                                                            <p className="text-xs font-medium truncate" style={{ color: event.color }}>{event.title}</p>
                                                            <p className="text-xs text-muted-foreground">{event.time}{event.endTime && ` - ${event.endTime}`}</p>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Agenda View */}
                {viewMode === "agenda" && (
                    <div className="max-w-2xl">
                        <div className="space-y-2">
                            {getUpcomingEvents().map((event, index) => {
                                const TypeIcon = typeConfig[event.type].icon;
                                const prevEvent = index > 0 ? getUpcomingEvents()[index - 1] : null;
                                const showDateHeader = !prevEvent || new Date(event.date).toDateString() !== new Date(prevEvent.date).toDateString();
                                return (
                                    <div key={event.id}>
                                        {showDateHeader && <h3 className="font-semibold text-sm text-muted-foreground mt-6 mb-2 first:mt-0">{formatDate(event.date)}</h3>}
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 sm:p-4 rounded-2xl border border-border bg-background hover:bg-accent/50 transition-colors group">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                {event.time ? (
                                                    <div className="text-center min-w-[50px] sm:min-w-[60px]">
                                                        <p className="font-mono font-medium text-sm sm:text-base">{event.time}</p>
                                                        {event.endTime && <p className="text-xs text-muted-foreground">{event.endTime}</p>}
                                                    </div>
                                                ) : (
                                                    <div className="min-w-[50px] sm:min-w-[60px] text-center"><span className="text-xs text-muted-foreground">Sin hora</span></div>
                                                )}
                                                <div className="w-1 h-10 sm:h-12 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className="h-4 w-4 flex-shrink-0" style={{ color: event.color }} />
                                                        <p className="font-medium truncate">{event.title}</p>
                                                    </div>
                                                    {event.spaceIcon && <p className="text-sm text-muted-foreground mt-1">{event.spaceIcon} {spaces.find(s => s.id === event.space)?.name}</p>}
                                                </div>
                                                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all flex-shrink-0"><MoreHorizontal className="h-4 w-4" /></button>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                        {getUpcomingEvents().length === 0 && (
                            <div className="text-center py-12">
                                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No hay eventos próximos</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
