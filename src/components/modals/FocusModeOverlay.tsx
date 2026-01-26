"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusModeOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    taskTitle?: string;
    taskProject?: string;
    initialMinutes?: number;
}

export function FocusModeOverlay({
    isOpen,
    onClose,
    taskTitle = "Review Q1 marketing strategy",
    taskProject = "Marketing",
    initialMinutes = 25,
}: FocusModeOverlayProps) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const [isRunning, setIsRunning] = useState(true);
    const [distractions, setDistractions] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(initialMinutes * 60);
            setIsRunning(true);
            setDistractions(0);
            return;
        }

        if (!isRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, isOpen, initialMinutes]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = ((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100;

    const logDistraction = () => {
        setDistractions((prev) => prev + 1);
    };

    const resetTimer = () => {
        setTimeLeft(initialMinutes * 60);
        setIsRunning(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="focus-overlay flex items-center justify-center p-4"
                >
                    {/* Ambient background effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: "1s" }} />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Content */}
                    <div className="relative text-center max-w-md">
                        {/* Timer */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <div className="relative inline-block">
                                {/* Progress ring */}
                                <svg width="200" height="200" className="progress-ring">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="4"
                                    />
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        fill="none"
                                        stroke="url(#focusGrad)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 90}
                                        strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#4F6BFF" />
                                            <stop offset="100%" stopColor="#A855F7" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-bold text-white tabular-nums">
                                        {formatTime(timeLeft)}
                                    </span>
                                    <span className="text-sm text-white/50 mt-1">remaining</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Task info */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8"
                        >
                            <p className="text-xs text-white/50 mb-1">{taskProject}</p>
                            <h2 className="text-xl text-white font-medium">{taskTitle}</h2>
                        </motion.div>

                        {/* Controls */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-4 mb-8"
                        >
                            <button
                                onClick={resetTimer}
                                className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <RotateCcw className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-zinc-900 hover:bg-white/90 transition-colors"
                            >
                                {isRunning ? (
                                    <Pause className="h-6 w-6" />
                                ) : (
                                    <Play className="h-6 w-6 ml-1" />
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                }}
                                className="p-3 text-mint hover:bg-mint/10 rounded-xl transition-colors"
                            >
                                <Check className="h-5 w-5" />
                            </button>
                        </motion.div>

                        {/* Distraction button */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                onClick={logDistraction}
                                className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-white/50 hover:text-coral hover:bg-coral/10 rounded-xl transition-colors"
                            >
                                <AlertCircle className="h-4 w-4" />
                                I got distracted
                                {distractions > 0 && (
                                    <span className="ml-1 px-2 py-0.5 bg-coral/20 text-coral text-xs rounded-full">
                                        {distractions}
                                    </span>
                                )}
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
