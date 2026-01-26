"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, Sparkles } from "lucide-react";
import { mockInsights } from "@/lib/mock-data";

export function QuickInsights() {
    const [insights, setInsights] = useState(mockInsights);

    const dismissInsight = (id: string) => {
        setInsights(insights.filter((i) => i.id !== id));
    };

    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Quick Insights</h3>
            </div>

            <AnimatePresence mode="popLayout">
                {insights.length > 0 ? (
                    <div className="space-y-2">
                        {insights.map((insight, index) => (
                            <motion.div
                                key={insight.id}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 group"
                            >
                                <span className="text-lg">{insight.icon}</span>
                                <p className="flex-1 text-sm">{insight.message}</p>
                                <button
                                    onClick={() => dismissInsight(insight.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded transition-all"
                                >
                                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 text-muted-foreground"
                    >
                        <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">All caught up!</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
