"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    RotateCcw,
    X,
    CheckCircle2,
    Coffee,
    Brain,
    Zap,
    Volume2,
    VolumeX,
    SkipForward,
    Settings,
    Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface FocusTask {
    id: string;
    title: string;
    space: string;
    spaceIcon: string;
    completed: boolean;
}

interface FocusModeProps {
    isOpen: boolean;
    onClose: () => void;
    task?: FocusTask;
    onTaskComplete?: (taskId: string) => void;
}

type TimerMode = "focus" | "shortBreak" | "longBreak";

const TIMER_SETTINGS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const MODE_CONFIG = {
    focus: {
        label: "Enfoque",
        icon: Brain,
        color: "#4F6BFF",
        bgGradient: "from-primary/20 to-primary/5",
    },
    shortBreak: {
        label: "Descanso corto",
        icon: Coffee,
        color: "#4ECDC4",
        bgGradient: "from-mint/20 to-mint/5",
    },
    longBreak: {
        label: "Descanso largo",
        icon: Zap,
        color: "#8B5CF6",
        bgGradient: "from-purple/20 to-purple/5",
    },
};

export function FocusMode({ isOpen, onClose, task, onTaskComplete }: FocusModeProps) {
    const [mode, setMode] = useState<TimerMode>("focus");
    const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const currentConfig = MODE_CONFIG[mode];
    const ModeIcon = currentConfig.icon;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = ((TIMER_SETTINGS[mode] - timeLeft) / TIMER_SETTINGS[mode]) * 100;

    const playSound = useCallback(() => {
        if (soundEnabled && typeof window !== "undefined") {
            const audio = new Audio("/notification.mp3");
            audio.volume = 0.5;
            audio.play().catch(() => {});
        }
    }, [soundEnabled]);

    const handleTimerComplete = useCallback(() => {
        playSound();
        
        if (mode === "focus") {
            const newCount = completedPomodoros + 1;
            setCompletedPomodoros(newCount);
            
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
            });

            // Every 4 pomodoros, suggest long break
            if (newCount % 4 === 0) {
                setMode("longBreak");
                setTimeLeft(TIMER_SETTINGS.longBreak);
            } else {
                setMode("shortBreak");
                setTimeLeft(TIMER_SETTINGS.shortBreak);
            }
        } else {
            setMode("focus");
            setTimeLeft(TIMER_SETTINGS.focus);
        }
        
        setIsRunning(false);
    }, [mode, completedPomodoros, playSound]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, handleTimerComplete]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(TIMER_SETTINGS[mode]);
    };

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_SETTINGS[newMode]);
        setIsRunning(false);
    };

    const handleTaskComplete = () => {
        if (task && onTaskComplete) {
            onTaskComplete(task.id);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const skipToNext = () => {
        handleTimerComplete();
    };

    // Update document title with timer
    useEffect(() => {
        if (isOpen) {
            document.title = `${formatTime(timeLeft)} - ${currentConfig.label} | FocusFlow`;
        }
        return () => {
            document.title = "FocusFlow - Tu Sistema Operativo Personal";
        };
    }, [isOpen, timeLeft, currentConfig.label]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background"
            >
                {/* Background gradient */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-all duration-500",
                    currentConfig.bgGradient
                )} />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 rounded-xl hover:bg-accent transition-colors z-10"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Sound toggle */}
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="absolute top-6 left-6 p-3 rounded-xl hover:bg-accent transition-colors z-10"
                >
                    {soundEnabled ? (
                        <Volume2 className="h-6 w-6" />
                    ) : (
                        <VolumeX className="h-6 w-6 text-muted-foreground" />
                    )}
                </button>

                {/* Main content */}
                <div className="relative h-full flex flex-col items-center justify-center px-6">
                    {/* Mode selector */}
                    <div className="flex gap-2 mb-8">
                        {(Object.keys(MODE_CONFIG) as TimerMode[]).map((m) => {
                            const config = MODE_CONFIG[m];
                            const Icon = config.icon;
                            return (
                                <button
                                    key={m}
                                    onClick={() => switchMode(m)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                        mode === m
                                            ? "bg-background shadow-lg"
                                            : "hover:bg-background/50"
                                    )}
                                    style={mode === m ? { color: config.color } : {}}
                                >
                                    <Icon className="h-4 w-4" />
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Task card */}
                    {task && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 rounded-2xl bg-background/80 backdrop-blur border border-border max-w-md w-full"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{task.spaceIcon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{task.title}</p>
                                    <p className="text-sm text-muted-foreground">{task.space}</p>
                                </div>
                                <button
                                    onClick={handleTaskComplete}
                                    className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        task.completed
                                            ? "bg-mint/20 text-mint"
                                            : "hover:bg-accent"
                                    )}
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Timer circle */}
                    <div className="relative mb-8">
                        <svg width="280" height="280" className="-rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="140"
                                cy="140"
                                r="130"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-muted/20"
                            />
                            {/* Progress circle */}
                            <motion.circle
                                cx="140"
                                cy="140"
                                r="130"
                                fill="none"
                                stroke={currentConfig.color}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 130}
                                strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
                                initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - progress / 100) }}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>
                        
                        {/* Timer display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <ModeIcon 
                                className="h-8 w-8 mb-2" 
                                style={{ color: currentConfig.color }}
                            />
                            <span className="text-6xl font-bold font-mono">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-sm text-muted-foreground mt-2">
                                {currentConfig.label}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={resetTimer}
                            className="p-4 rounded-2xl hover:bg-background/80 transition-colors"
                        >
                            <RotateCcw className="h-6 w-6" />
                        </button>
                        
                        <motion.button
                            onClick={toggleTimer}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-6 rounded-full text-white shadow-lg"
                            style={{ backgroundColor: currentConfig.color }}
                        >
                            {isRunning ? (
                                <Pause className="h-8 w-8" />
                            ) : (
                                <Play className="h-8 w-8 ml-1" />
                            )}
                        </motion.button>

                        <button
                            onClick={skipToNext}
                            className="p-4 rounded-2xl hover:bg-background/80 transition-colors"
                        >
                            <SkipForward className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Pomodoro counter */}
                    <div className="flex items-center gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-colors",
                                    i < (completedPomodoros % 4)
                                        ? "bg-primary"
                                        : "bg-muted"
                                )}
                            />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                            {completedPomodoros} pomodoros completados
                        </span>
                    </div>

                    {/* Keyboard shortcuts hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">Espacio</kbd> play/pausa
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">R</kbd> reiniciar
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">Esc</kbd> cerrar
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
