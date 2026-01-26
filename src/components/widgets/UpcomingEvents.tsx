"use client";

import { motion } from "framer-motion";
import { Calendar, Video, ExternalLink } from "lucide-react";
import { mockEvents } from "@/lib/mock-data";

const platformIcons: Record<string, { icon: string; color: string }> = {
    zoom: { icon: "📹", color: "#2D8CFF" },
    meet: { icon: "🎥", color: "#00897B" },
    teams: { icon: "💬", color: "#6264A7" },
    other: { icon: "📅", color: "#6B7280" },
};

export function UpcomingEvents() {
    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Upcoming</h3>
                </div>
                <button className="text-xs text-primary hover:underline">See all</button>
            </div>

            <div className="space-y-3">
                {mockEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                    >
                        <div className="text-center min-w-[50px]">
                            <p className="text-[10px] text-muted-foreground">{event.date}</p>
                            <p className="text-sm font-semibold">{event.time}</p>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: platformIcons[event.platform].color }}
                                />
                                <span className="text-xs text-muted-foreground capitalize">
                                    {event.platform}
                                </span>
                            </div>
                        </div>

                        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent rounded-lg transition-all">
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
