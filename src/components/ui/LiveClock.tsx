"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function LiveClock() {
    const [time, setTime] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium tabular-nums">--:--</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium tabular-nums">{time}</span>
        </div>
    );
}
