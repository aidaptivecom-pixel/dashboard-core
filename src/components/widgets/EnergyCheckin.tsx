"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Battery, BatteryLow, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type EnergyLevel = "low" | "medium" | "high";

interface EnergyOption {
    level: EnergyLevel;
    icon: React.ElementType;
    label: string;
    emoji: string;
    color: string;
}

const energyOptions: EnergyOption[] = [
    {
        level: "low",
        icon: BatteryLow,
        label: "Low",
        emoji: "🔋",
        color: "from-coral/20 to-coral/5 hover:from-coral/30 hover:to-coral/10 border-coral/20",
    },
    {
        level: "medium",
        icon: Battery,
        label: "Medium",
        emoji: "⚡",
        color: "from-yellow-400/20 to-yellow-400/5 hover:from-yellow-400/30 hover:to-yellow-400/10 border-yellow-400/20",
    },
    {
        level: "high",
        icon: Zap,
        label: "High",
        emoji: "🚀",
        color: "from-mint/20 to-mint/5 hover:from-mint/30 hover:to-mint/10 border-mint/20",
    },
];

export function EnergyCheckin() {
    const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
        >
            <h3 className="font-semibold mb-2">How&apos;s your energy?</h3>
            <p className="text-sm text-muted-foreground mb-4">
                This helps prioritize your tasks
            </p>

            <div className="grid grid-cols-3 gap-3">
                {energyOptions.map((option) => (
                    <button
                        key={option.level}
                        onClick={() => setSelectedEnergy(option.level)}
                        className={cn(
                            "relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                            "bg-gradient-to-b",
                            option.color,
                            selectedEnergy === option.level &&
                            "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        )}
                    >
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                        {selectedEnergy === option.level && (
                            <motion.div
                                layoutId="energy-indicator"
                                className="absolute inset-0 border-2 border-primary rounded-xl"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {selectedEnergy && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground mt-4 text-center"
                >
                    {selectedEnergy === "low"
                        ? "Showing easier tasks that don't require deep focus"
                        : selectedEnergy === "medium"
                            ? "Balanced mix of tasks for your current energy"
                            : "Prioritizing high-impact tasks that need focus"}
                </motion.p>
            )}
        </motion.div>
    );
}
