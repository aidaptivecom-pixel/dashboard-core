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
    X,
    Trash2,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { useSpaces } from "@/hooks/useSpaces";

type ViewMode = "month" | "week" | "agenda";
type EventType = "task" | "meeting" | "call" | "deadline" | "reminder";

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    start_time: string | null;
    end_time: string | null;
    type: EventType | null;
    space_id: string | null;
    color: string | null;
    description: string | null;
}

const typeConfig: Record<EventType, { icon: typeof Circle; label: string; color: string }> = {
    task: { icon: Circle, label: "Tarea", color: "#4F6BFF" },
    meeting: { icon: Video, label: "Reunión", color: "#8B5CF6" },
    call: { icon: Phone, label: "Llamada", color: "#10B981" },
    deadline: { icon: AlertCircle, label: "Deadline", color: "#EF4444" },
    reminder: { icon: Clock, label: "Recordatorio", color: "#F59E0B" },
};

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [spaceFilter, setSpaceFilter] = useState<string | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        start_time: "",
        end_time: "",
        type: "task" as EventType,
        space_id: "",
        description: "",
    });

    const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
    const { spaces } = useSpaces();

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
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => {
            const matchesDate = event.date === dateStr;
            const matchesSpace = !spaceFilter || event.space_id === spaceFilter;
            return matchesDate && matchesSpace;
        });
    };

    const getEventColor = (event: CalendarEvent) => {
        if (event.color) return event.color;
        if (event.space_id) {
            const space = spaces.find(s => s.id === event.space_id);
            if (space?.color) return space.color;
        }
        if (event.type && typeConfig[event.type]) {
            return typeConfig[event.type].color;
        }
        return "#4F6BFF";
    };

    const getSpaceIcon = (spaceId: string | null) => {
        if (!spaceId) return null;
        const space = spaces.find(s => s.id === spaceId);
        return space?.icon || null;
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
        const todayStr = new Date().toISOString().split('T')[0];
        return events
            .filter(e => e.date >= todayStr && (!spaceFilter || e.space_id === spaceFilter))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 10);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        if (dateStr === today.toISOString().split('T')[0]) return "Hoy";
        if (dateStr === tomorrow.toISOString().split('T')[0]) return "Mañana";
        return date.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
    };

    const getWeekRange = () => {
        const start = weekDays[0], end = weekDays[6];
        if (start.getMonth() === end.getMonth()) return `${start.getDate()} - ${end.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
        return `${start.getDate()} ${MONTHS[start.getMonth()].slice(0, 3)} - ${end.getDate()} ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
    };

    const getEventPosition = (time: string) => { const [hours, minutes] = time.split(":").map(Number); return ((hours - 7) * 60 + minutes) * (60 / 60); };
    const getEventHeight = (startTime: string, endTime?: string | null) => { if (!endTime) return 30; const [startH, startM] = startTime.split(":").map(Number); const [endH, endM] = endTime.split(":").map(Number); return Math.max((endH * 60 + endM) - (startH * 60 + startM), 30); };

    const openNewEventModal = (date?: Date) => {
        const targetDate = date || selectedDate;
        setEditingEvent(null);
        setNewEvent({
            title: "",
            date: targetDate.toISOString().split('T')[0],
            start_time: "",
            end_time: "",
            type: "task",
            space_id: "",
            description: "",
        });
        setShowEventModal(true);
    };

    const openEditEventModal = (event: CalendarEvent) => {
        setEditingEvent(event);
        setNewEvent({
            title: event.title,
            date: event.date,
            start_time: event.start_time || "",
            end_time: event.end_time || "",
            type: event.type || "task",
            space_id: event.space_id || "",
            description: event.description || "",
        });
        setShowEventModal(true);
    };

    const handleSaveEvent = async () => {
        if (!newEvent.title.trim() || !newEvent.date) return;

        if (editingEvent) {
            await updateEvent(editingEvent.id, {
                title: newEvent.title,
                date: newEvent.date,
                start_time: newEvent.start_time || null,
                end_time: newEvent.end_time || null,
                type: newEvent.type,
                space_id: newEvent.space_id || null,
                description: newEvent.description || null,
            });
        } else {
            await createEvent({
                title: newEvent.title,
                date: newEvent.date,
                start_time: newEvent.start_time || undefined,
                end_time: newEvent.end_time || undefined,
                type: newEvent.type,
            });
        }

        setShowEventModal(false);
        setEditingEvent(null);
    };

    const handleDeleteEvent = async () => {
        if (!editingEvent) return;
        await deleteEvent(editingEvent.id);
        setShowEventModal(false);
        setEditingEvent(null);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

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
                    <button onClick={() => openNewEventModal()} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Nuevo evento
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 mb-6">
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

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted overflow-x-auto flex-shrink-0">
                            <button onClick={() => setSpaceFilter(null)} className={cn("px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap", !spaceFilter ? "bg-background shadow-sm" : "hover:bg-background/50")}>Todos</button>
                            {spaces.map(space => (
                                <button key={space.id} onClick={() => setSpaceFilter(spaceFilter === space.id ? null : space.id)} className={cn("px-2 py-1.5 rounded-lg text-sm transition-colors", spaceFilter === space.id ? "bg-background shadow-sm" : "hover:bg-background/50")} title={space.name}>{space.icon}</button>
                            ))}
                        </div>
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
                                                        <div key={event.id} className="text-xs px-1 py-0.5 rounded truncate" style={{ backgroundColor: `${getEventColor(event)}20`, color: getEventColor(event) }}>
                                                            {event.start_time && <span className="font-mono mr-1">{event.start_time.slice(0, 5)}</span>}{event.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && <div className="text-xs text-muted-foreground px-1">+{dayEvents.length - 2}</div>}
                                                </div>
                                                {dayEvents.length > 0 && <div className="sm:hidden flex gap-0.5 mt-1">{dayEvents.slice(0, 3).map(e => <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getEventColor(e) }} />)}</div>}
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
                                            const TypeIcon = event.type && typeConfig[event.type] ? typeConfig[event.type].icon : Circle;
                                            const color = getEventColor(event);
                                            return (
                                                <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => openEditEventModal(event)} className="p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors group cursor-pointer">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${color}15` }}><TypeIcon className="h-4 w-4" style={{ color }} /></div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{event.title}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {event.start_time && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{event.start_time.slice(0, 5)}{event.end_time && ` - ${event.end_time.slice(0, 5)}`}</span>}
                                                                {getSpaceIcon(event.space_id) && <span className="text-xs">{getSpaceIcon(event.space_id)}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">No hay eventos</p>
                                        <button onClick={() => openNewEventModal(selectedDate)} className="mt-3 text-sm text-primary hover:underline">+ Agregar evento</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Week View */}
                {viewMode === "week" && (
                    <div className="rounded-2xl border border-border bg-background overflow-hidden">
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
                                            <button onClick={() => openNewEventModal(date)} className="text-xs text-primary">+ Agregar</button>
                                        </div>
                                        {dayEvents.length > 0 ? (
                                            <div className="p-2 space-y-2">
                                                {dayEvents.map(event => (
                                                    <div key={event.id} onClick={() => openEditEventModal(event)} className="p-2 rounded-lg text-sm cursor-pointer" style={{ backgroundColor: `${getEventColor(event)}15`, borderLeft: `3px solid ${getEventColor(event)}` }}>
                                                        <p className="font-medium truncate" style={{ color: getEventColor(event) }}>{event.title}</p>
                                                        {event.start_time && <p className="text-xs text-muted-foreground">{event.start_time.slice(0, 5)}{event.end_time && ` - ${event.end_time.slice(0, 5)}`}</p>}
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
                                        const dayEvents = getEventsForDate(date).filter(e => e.start_time);
                                        const allDayEvents = getEventsForDate(date).filter(e => !e.start_time);
                                        return (
                                            <div key={dayIndex} className={cn("relative border-r border-border last:border-r-0", isToday(date) && "bg-primary/5")}>
                                                {allDayEvents.length > 0 && (
                                                    <div className="absolute top-0 left-0 right-0 p-1 z-10">
                                                        {allDayEvents.slice(0, 2).map(event => (<div key={event.id} onClick={() => openEditEventModal(event)} className="text-xs px-1.5 py-0.5 rounded mb-1 truncate cursor-pointer" style={{ backgroundColor: `${getEventColor(event)}30`, color: getEventColor(event), borderLeft: `3px solid ${getEventColor(event)}` }}>{event.title}</div>))}
                                                    </div>
                                                )}
                                                {HOURS.map(hour => (<div key={hour} className="h-[60px] border-b border-border hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => openNewEventModal(date)} />))}
                                                {dayEvents.map(event => {
                                                    if (!event.start_time) return null;
                                                    const top = getEventPosition(event.start_time);
                                                    const height = getEventHeight(event.start_time, event.end_time);
                                                    return (
                                                        <motion.div key={event.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => openEditEventModal(event)} className="absolute left-1 right-1 rounded-lg px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden" style={{ top: `${top}px`, height: `${height}px`, backgroundColor: `${getEventColor(event)}20`, borderLeft: `3px solid ${getEventColor(event)}` }}>
                                                            <p className="text-xs font-medium truncate" style={{ color: getEventColor(event) }}>{event.title}</p>
                                                            <p className="text-xs text-muted-foreground">{event.start_time.slice(0, 5)}{event.end_time && ` - ${event.end_time.slice(0, 5)}`}</p>
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
                                const TypeIcon = event.type && typeConfig[event.type] ? typeConfig[event.type].icon : Circle;
                                const color = getEventColor(event);
                                const prevEvent = index > 0 ? getUpcomingEvents()[index - 1] : null;
                                const showDateHeader = !prevEvent || event.date !== prevEvent.date;
                                return (
                                    <div key={event.id}>
                                        {showDateHeader && <h3 className="font-semibold text-sm text-muted-foreground mt-6 mb-2 first:mt-0">{formatDate(event.date)}</h3>}
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => openEditEventModal(event)} className="p-3 sm:p-4 rounded-2xl border border-border bg-background hover:bg-accent/50 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                {event.start_time ? (
                                                    <div className="text-center min-w-[50px] sm:min-w-[60px]">
                                                        <p className="font-mono font-medium text-sm sm:text-base">{event.start_time.slice(0, 5)}</p>
                                                        {event.end_time && <p className="text-xs text-muted-foreground">{event.end_time.slice(0, 5)}</p>}
                                                    </div>
                                                ) : (
                                                    <div className="min-w-[50px] sm:min-w-[60px] text-center"><span className="text-xs text-muted-foreground">Todo el día</span></div>
                                                )}
                                                <div className="w-1 h-10 sm:h-12 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className="h-4 w-4 flex-shrink-0" style={{ color }} />
                                                        <p className="font-medium truncate">{event.title}</p>
                                                    </div>
                                                    {getSpaceIcon(event.space_id) && <p className="text-sm text-muted-foreground mt-1">{getSpaceIcon(event.space_id)} {spaces.find(s => s.id === event.space_id)?.name}</p>}
                                                </div>
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
                                <button onClick={() => openNewEventModal()} className="mt-4 text-primary hover:underline">+ Crear evento</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Event Modal */}
            <AnimatePresence>
                {showEventModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEventModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-[5%] sm:top-[10%] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50">
                            <div className="bg-background rounded-2xl border border-border shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">{editingEvent ? "Editar evento" : "Nuevo evento"}</h3>
                                    <button onClick={() => setShowEventModal(false)} className="p-2 rounded-lg hover:bg-accent"><X className="h-5 w-5" /></button>
                                </div>

                                <div className="space-y-4">
                                    <input type="text" placeholder="Título del evento" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" autoFocus />

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-1 block">Fecha</label>
                                            <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
                                            <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                                                {Object.entries(typeConfig).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-1 block">Hora inicio</label>
                                            <input type="time" value={newEvent.start_time} onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-1 block">Hora fin</label>
                                            <input type="time" value={newEvent.end_time} onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1 block">Espacio (opcional)</label>
                                        <select value={newEvent.space_id} onChange={(e) => setNewEvent({ ...newEvent, space_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                                            <option value="">Sin espacio</option>
                                            {spaces.map(space => (
                                                <option key={space.id} value={space.id}>{space.icon} {space.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <textarea placeholder="Descripción (opcional)" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20" />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    {editingEvent && (
                                        <button onClick={handleDeleteEvent} className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button onClick={() => setShowEventModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors">Cancelar</button>
                                    <button onClick={handleSaveEvent} disabled={!newEvent.title.trim() || !newEvent.date} className="flex-1 btn-primary disabled:opacity-50">{editingEvent ? "Guardar" : "Crear"}</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
