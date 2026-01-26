"use client";

import { UpcomingEvents } from "@/components/widgets/UpcomingEvents";
import { AIMiniChat } from "@/components/widgets/AIMiniChat";
import { QuickInsights } from "@/components/widgets/QuickInsights";

export function RightPanel() {
    return (
        <aside className="hidden xl:flex xl:w-80 2xl:w-96 flex-col gap-4 p-4 border-l border-border bg-background/50 backdrop-blur-sm overflow-y-auto custom-scrollbar">
            <UpcomingEvents />
            <AIMiniChat />
            <QuickInsights />
        </aside>
    );
}
