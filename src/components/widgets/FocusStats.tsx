"use client";

import { motion } from "framer-motion";
import { Play, Target } from "lucide-react";
import { mockUser, mockFocusData } from "@/lib/mock-data";

export function FocusStats() {
    const { focusGoalHours, focusCompletedHours } = mockUser;
    const progress = (focusCompletedHours / focusGoalHours) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card-mint p-5"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold">Focus Stats</h3>
                    <p className="text-sm text-muted-foreground">Daily progress</p>
                </div>
                <Target className="h-5 w-5 text-mint" />
            </div>

            <div className="flex items-center gap-6">
                {/* Circular Progress */}
                <div className="relative">
                    <svg width="100" height="100" className="progress-ring">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-muted/30"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4ECDC4" />
                                <stop offset="100%" stopColor="#4F6BFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">{focusCompletedHours}h</span>
                        <span className="text-xs text-muted-foreground">/ {focusGoalHours}h</span>
                    </div>
                </div>

                {/* Mini Chart Preview */}
                <div className="flex-1">
                    <div className="flex items-end gap-1 h-12">
                        {mockFocusData.slice(0, 8).map((d, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-mint/50 to-mint/20 rounded-t"
                                style={{ height: `${Math.max((d.focus / 60) * 100, 10)}%` }}
                            />
                        ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Today&apos;s focus periods</p>
                </div>
            </div>

            <button className="btn-primary w-full mt-4">
                <Play className="h-4 w-4 mr-2" />
                Start Focus Session
            </button>
        </motion.div>
    );
}
