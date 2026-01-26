"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Battery,
    BatteryLow,
    BatteryMedium,
    Check,
    SkipForward,
    ChevronDown,
    Sparkles,
    Clock,
} from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { mockTasks } from "@/lib/mock-data";

const energyIcons = {
    low: BatteryLow,
    medium: BatteryMedium,
    high: Battery,
};

const energyLabels = {
    low: "Low Energy",
    medium: "Medium Energy",
    high: "High Energy",
};

export function FocusNowCard() {
    const [showReasoning, setShowReasoning] = useState(false);
    const currentTask = mockTasks.find((t) => !t.completed);

    if (!currentTask) return null;

    const EnergyIcon = energyIcons[currentTask.energyLevel];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-blue p-6 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-sm font-semibold text-primary">Focus Now</h2>
                </div>

                {/* Task Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                    {currentTask.title}
                </h3>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* Project Tag */}
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                            backgroundColor: `${currentTask.projectColor}15`,
                            color: currentTask.projectColor,
                        }}
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: currentTask.projectColor }}
                        />
                        {currentTask.project}
                    </span>

                    {/* Time Estimate */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(currentTask.estimatedMinutes)}
                    </span>

                    {/* Energy Level */}
                    <span
                        className={cn(
                            "energy-badge",
                            currentTask.energyLevel === "low" && "energy-low",
                            currentTask.energyLevel === "medium" && "energy-medium",
                            currentTask.energyLevel === "high" && "energy-high"
                        )}
                    >
                        <EnergyIcon className="h-3 w-3" />
                        {energyLabels[currentTask.energyLevel]}
                    </span>
                </div>

                {/* AI Reasoning */}
                <button
                    onClick={() => setShowReasoning(!showReasoning)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <Sparkles className="h-3 w-3" />
                    Why this task?
                    <ChevronDown
                        className={cn(
                            "h-3 w-3 transition-transform",
                            showReasoning && "rotate-180"
                        )}
                    />
                </button>

                <AnimatePresence>
                    {showReasoning && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 rounded-xl bg-background/50 text-sm text-muted-foreground mb-4">
                                <p>
                                    Based on your current high energy level and typical productivity
                                    patterns, this task aligns well with your morning focus window.
                                    Marketing reviews require creative thinking, which you excel at
                                    before 11am.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button className="btn-primary flex-1 py-3">
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                    </button>
                    <button className="btn-secondary py-3 px-4">
                        <SkipForward className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
