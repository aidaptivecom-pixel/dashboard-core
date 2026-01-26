"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { mockScreenTime } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";

export function ScreenTime() {
    const totalMinutes = mockScreenTime.reduce((sum, p) => sum + p.minutes, 0);
    const maxMinutes = Math.max(...mockScreenTime.map((p) => p.minutes));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-5"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple" />
                    <h3 className="font-semibold">Screen Time</h3>
                </div>
                <span className="text-lg font-bold">{formatTime(totalMinutes)}</span>
            </div>

            <div className="space-y-3">
                {mockScreenTime.map((project, index) => (
                    <motion.div
                        key={project.project}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{project.project}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatTime(project.minutes)}
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(project.minutes / maxMinutes) * 100}%` }}
                                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: project.color }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
