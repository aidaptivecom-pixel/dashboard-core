"use client";

import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { MobileNav } from "./MobileNav";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-muted/30 dark:bg-zinc-950 p-3 md:p-4">
            <div className="flex gap-4 h-[calc(100vh-24px)] md:h-[calc(100vh-32px)]">
                {/* Desktop Sidebar */}
                <div className="hidden md:block flex-shrink-0">
                    <Sidebar />
                </div>

                {/* Main Content Area - Card Container */}
                <main className="flex-1 bg-background rounded-2xl border border-border shadow-sm overflow-y-auto custom-scrollbar">
                    <div className="p-6 lg:p-8">
                        {children}
                    </div>
                </main>

                {/* Right Panel - Desktop Only - Card Container */}
                <div className="hidden xl:block flex-shrink-0">
                    <RightPanel />
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    );
}
