"use client";

import { UpcomingEvents } from "@/components/widgets/UpcomingEvents";
import { AIMiniChat } from "@/components/widgets/AIMiniChat";
import { QuickInsights } from "@/components/widgets/QuickInsights";

export function RightPanel() {
    return (
        <aside className="w-80 2xl:w-96 h-full bg-background flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto custom-scrollbar">
                <UpcomingEvents />
                <AIMiniChat />
                <QuickInsights />
                {/* Bottom padding for scroll */}
                <div className="h-4 flex-shrink-0" />
            </div>
        </aside>
    );
}
