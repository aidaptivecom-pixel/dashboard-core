"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Video, ArrowRight } from "lucide-react";
import { mockEvents } from "@/lib/mock-data";

export function NextEvent() {
    const nextEvent = mockEvents[0]; // First upcoming event
    
    if (!nextEvent) return null;

    const getPlatformIcon = (platform: string) => {
        return <Video className="h-3 w-3" />;
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case "zoom": return "bg-blue-500";
            case "meet": return "bg-green-500";
            case "teams": return "bg-purple-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-sm truncate max-w-[140px]">{nextEvent.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{nextEvent.time}</span>
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-white text-[10px] ${getPlatformColor(nextEvent.platform)}`}>
                                {getPlatformIcon(nextEvent.platform)}
                                {nextEvent.platform}
                            </span>
                        </div>
                    </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </motion.div>
    );
}
