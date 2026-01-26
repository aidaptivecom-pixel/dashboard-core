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
    CheckCircle2,
    Circle,
    MoreHorizontal,
    Filter,
    List,
    Grid3X3,
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

// Generate mock events
const generateMockEvents = (): CalendarEvent[] => {
    const today = new Date();
    const events: CalendarEvent[] = [
        {
            id: "1",
            title: "Daily Standup",
            date: today,
            time: "10:00",
            endTime: "10:30",
            type: "meeting",
            space: "aidaptive",
            spaceIcon: "🤖",
            color: "#4F6BFF",
        },
        {
            id: "2",
            title: "Revisar propuesta cliente ABC",
            date: today,
            type: "task",
            space: "aidaptive",
            spaceIcon: "🤖",
            color: "#4F6BFF",
        },
        {
            id: "3",
            title: "Call con inversores",
            date: today,
            time: "14:00",
            endTime: "15:00",
            type: "call",
            space: "limbo",
            spaceIcon: "🚀",
            color: "#8B5CF6",
        },
        {
            id: "4",
            title: "Deadline: Entregar diseños",
            date: today,
            type: "deadline",
            space: "limbo",
            spaceIcon: "🚀",
            color: "#8B5CF6",
        },
        {
            id: "5",
            title: "Llamar proveedor macetas",
            date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            time: "11:00",
            type: "call",
            space: "igreen",
            spaceIcon: "🌱",
            color: "#10B981",
        },
        {
            id: "6",
            title: "Pagar facturas",
            date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            type: "task",
            space: "personal",
            spaceIcon: "👤",
            color: "#F59E0B",
        },
        {
            id: "7",
            title: "Review código CRM",
            date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            time: "16:00",
            endTime: "17:00",
            type: "meeting",
            space: "aidaptive",
            spaceIcon: "🤖",
            color: "#4F6BFF",
        },
        {
            id: "8",
            title: "Dentista",
            date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
            time: "09:00",
            type: "reminder",
            space: "personal",
            spaceIcon: "👤",
            color: "#F59E0B",
        },
        {
            id: "9",
            title: "Terminar landing page",
            date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
            type: "deadline",
            space: "limbo",
            spaceIcon: "🚀",
            color: "#8B5CF6",
        },
        {
            id: "10",
            title: "Sesión fotos productos",
            date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
            time: "10:00",
            endTime: "13:00",
            type: "task",
            space: "igreen",
            spaceIcon: "🌱",
            color: "#10B981",
        },
    ];
    return events;
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

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [events] = useState(generateMockEvents());
    const [spaceFilter, setSpaceFilter] = useState<string | null>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days: (Date | null)[] = [];
        
        // Add empty slots for days before the first of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
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

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const isToday = (date: Date) => {
        const t = new Date();
        return date.getDate() === t.getDate() && 
               date.getMonth() === t.getMonth() && 
               date.getFullYear() === t.getFullYear();
    };

    const isSelected = (date: Date) => {
        return date.getDate() === selectedDate.getDate() && 
               date.getMonth() === selectedDate.getMonth() && 
               date.getFullYear() === selectedDate.getFullYear();
    };

    const selectedDateEvents = getEventsForDate(selectedDate);
    const days = getDaysInMonth(currentDate);

    // Get upcoming events for agenda view
    const getUpcomingEvents = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        return events
            .filter(e => {
                const eventDate = new Date(e.date);
                eventDate.setHours(0, 0, 0, 0);
                const matchesSpace = !spaceFilter || e.space === spaceFilter;
                return eventDate >= now && matchesSpace;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 10);
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        
        if (d.toDateString() === today.toDateString()) return "Hoy";
        if (d.toDateString() === tomorrow.toDateString()) return "Mañana";
        
        return d.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <CalendarIcon className="h-7 w-7" />
                            Calendario
                        </h1>
                        <p className="text-muted-foreground">
                            Tareas, reuniones y deadlines
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="btn-primary flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo evento
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Month Navigation */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigateMonth(-1)}
                            className="p-2 rounded-xl hover:bg-accent transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h2 className="text-lg font-semibold min-w-[180px] text-center">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button 
                            onClick={() => navigateMonth(1)}
                            className="p-2 rounded-xl hover:bg-accent transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={goToToday}
                            className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent transition-colors ml-2"
                        >
                            Hoy
                        </button>
                    </div>

                    <div className="flex items-center gap-2 sm:ml-auto">
                        {/* Space Filter */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted">
                            <button
                                onClick={() => setSpaceFilter(null)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm transition-colors",
                                    !spaceFilter ? "bg-background shadow-sm" : "hover:bg-background/50"
                                )}
                            >
                                Todos
                            </button>
                            {spaces.map(space => (
                                <button
                                    key={space.id}
                                    onClick={() => setSpaceFilter(spaceFilter === space.id ? null : space.id)}
                                    className={cn(
                                        "px-2 py-1.5 rounded-lg text-sm transition-colors",
                                        spaceFilter === space.id ? "bg-background shadow-sm" : "hover:bg-background/50"
                                    )}
                                    title={space.name}
                                >
                                    {space.icon}
                                </button>
                            ))}
                        </div>

                        {/* View Mode */}
                        <div className="flex border border-border rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode("month")}
                                className={cn(
                                    "p-2 transition-colors",
                                    viewMode === "month" ? "bg-accent" : "hover:bg-accent"
                                )}
                                title="Vista mensual"
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("agenda")}
                                className={cn(
                                    "p-2 transition-colors",
                                    viewMode === "agenda" ? "bg-accent" : "hover:bg-accent"
                                )}
                                title="Vista agenda"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === "month" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Calendar Grid */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-border bg-background overflow-hidden">
                                {/* Days header */}
                                <div className="grid grid-cols-7 border-b border-border">
                                    {DAYS.map(day => (
                                        <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Calendar days */}
                                <div className="grid grid-cols-7">
                                    {days.map((date, index) => {
                                        if (!date) {
                                            return <div key={`empty-${index}`} className="p-2 min-h-[100px] border-b border-r border-border bg-muted/30" />;
                                        }
                                        
                                        const dayEvents = getEventsForDate(date);
                                        const isCurrentDay = isToday(date);
                                        const isSelectedDay = isSelected(date);
                                        
                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => setSelectedDate(date)}
                                                className={cn(
                                                    "p-2 min-h-[100px] border-b border-r border-border text-left transition-colors hover:bg-accent/50",
                                                    isSelectedDay && "bg-primary/5",
                                                    date.getMonth() !== currentDate.getMonth() && "opacity-40"
                                                )}
                                            >
                                                <span className={cn(
                                                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                                                    isCurrentDay && "bg-primary text-white font-bold",
                                                    isSelectedDay && !isCurrentDay && "bg-primary/20 font-medium"
                                                )}>
                                                    {date.getDate()}
                                                </span>
                                                
                                                {/* Event dots */}
                                                <div className="mt-1 space-y-1">
                                                    {dayEvents.slice(0, 3).map(event => (
                                                        <div
                                                            key={event.id}
                                                            className="text-xs px-1.5 py-0.5 rounded truncate"
                                                            style={{ 
                                                                backgroundColor: `${event.color}20`,
                                                                color: event.color 
                                                            }}
                                                        >
                                                            {event.time && <span className="font-mono mr-1">{event.time}</span>}
                                                            {event.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 3 && (
                                                        <div className="text-xs text-muted-foreground px-1.5">
                                                            +{dayEvents.length - 3} más
                                                        </div>
                                                    )}
                                                </div>
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
                                    <span className={cn(
                                        "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm",
                                        isToday(selectedDate) && "bg-primary text-white"
                                    )}>
                                        {selectedDate.getDate()}
                                    </span>
                                    {selectedDate.toLocaleDateString("es", { weekday: "long", month: "long" })}
                                </h3>

                                {selectedDateEvents.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedDateEvents.map(event => {
                                            const TypeIcon = typeConfig[event.type].icon;
                                            
                                            return (
                                                <motion.div
                                                    key={event.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div 
                                                            className="p-2 rounded-lg"
                                                            style={{ backgroundColor: `${event.color}15` }}
                                                        >
                                                            <TypeIcon 
                                                                className="h-4 w-4" 
                                                                style={{ color: event.color }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm">{event.title}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {event.time && (
                                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {event.time}
                                                                        {event.endTime && ` - ${event.endTime}`}
                                                                    </span>
                                                                )}
                                                                {event.spaceIcon && (
                                                                    <span className="text-xs">{event.spaceIcon}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-all">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">No hay eventos</p>
                                        <button className="mt-3 text-sm text-primary hover:underline">
                                            + Agregar evento
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Agenda View */
                    <div className="max-w-2xl">
                        <div className="space-y-2">
                            {getUpcomingEvents().map((event, index) => {
                                const TypeIcon = typeConfig[event.type].icon;
                                const prevEvent = index > 0 ? getUpcomingEvents()[index - 1] : null;
                                const showDateHeader = !prevEvent || 
                                    new Date(event.date).toDateString() !== new Date(prevEvent.date).toDateString();
                                
                                return (
                                    <div key={event.id}>
                                        {showDateHeader && (
                                            <h3 className="font-semibold text-sm text-muted-foreground mt-6 mb-2 first:mt-0">
                                                {formatDate(event.date)}
                                            </h3>
                                        )}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-2xl border border-border bg-background hover:bg-accent/50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                {event.time ? (
                                                    <div className="text-center min-w-[60px]">
                                                        <p className="font-mono font-medium">{event.time}</p>
                                                        {event.endTime && (
                                                            <p className="text-xs text-muted-foreground">{event.endTime}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="min-w-[60px] text-center">
                                                        <span className="text-xs text-muted-foreground">Sin hora</span>
                                                    </div>
                                                )}
                                                
                                                <div 
                                                    className="w-1 h-12 rounded-full"
                                                    style={{ backgroundColor: event.color }}
                                                />
                                                
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className="h-4 w-4" style={{ color: event.color }} />
                                                        <p className="font-medium">{event.title}</p>
                                                    </div>
                                                    {event.spaceIcon && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {event.spaceIcon} {spaces.find(s => s.id === event.space)?.name}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
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
