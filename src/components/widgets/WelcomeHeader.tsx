"use client";

import { Search, Plus, Mic, Command } from "lucide-react";
import { getGreeting, formatDate } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";
import { LiveClock } from "@/components/ui/LiveClock";

interface WelcomeHeaderProps {
    onOpenCapture: () => void;
    onOpenSearch: () => void;
}

export function WelcomeHeader({ onOpenCapture, onOpenSearch }: WelcomeHeaderProps) {
    const greeting = getGreeting();
    const today = formatDate(new Date());

    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Top Row: Greeting + Time + Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {greeting}, <span className="text-gradient">{mockUser.name}</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">{today}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {/* Live Clock */}
                    <LiveClock />

                    {/* Search Bar */}
                    <button
                        onClick={onOpenSearch}
                        className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-accent transition-colors min-w-[200px]"
                    >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground flex-1 text-left">Search...</span>
                        <kbd className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted rounded">
                            <Command className="h-3 w-3" />K
                        </kbd>
                    </button>

                    {/* Mobile Search */}
                    <button
                        onClick={onOpenSearch}
                        className="md:hidden p-2.5 rounded-xl border border-border hover:bg-accent transition-colors"
                    >
                        <Search className="h-4 w-4" />
                    </button>

                    {/* Quick Capture Button */}
                    <button
                        onClick={onOpenCapture}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden md:inline text-sm font-medium">Capture</span>
                    </button>

                    {/* Voice Button */}
                    <button className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors">
                        <Mic className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
