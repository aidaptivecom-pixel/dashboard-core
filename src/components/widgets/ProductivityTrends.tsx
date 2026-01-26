"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { mockFocusData } from "@/lib/mock-data";

type TimeRange = "today" | "week" | "month";

export function ProductivityTrends() {
    const [range, setRange] = useState<TimeRange>("today");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Productivity Trends</h3>
                </div>

                {/* Time Range Toggle */}
                <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
                    {(["today", "week", "month"] as TimeRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={cn(
                                "px-2.5 py-1 text-xs font-medium rounded-md transition-all capitalize",
                                range === r
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-mint" />
                    <span className="text-xs text-muted-foreground">Deep Focus</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-coral/50" />
                    <span className="text-xs text-muted-foreground">Scattered</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockFocusData}>
                        <defs>
                            <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4F6BFF" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#4F6BFF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="scatteredGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "0.75rem",
                                fontSize: "12px",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="focus"
                            stroke="#4F6BFF"
                            strokeWidth={2}
                            fill="url(#focusGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="scattered"
                            stroke="#FF6B6B"
                            strokeWidth={2}
                            fill="url(#scatteredGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
