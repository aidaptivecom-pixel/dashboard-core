"use client";

import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { MobileNav } from "./MobileNav";
import { Header } from "./Header";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-muted/50 dark:bg-zinc-950 p-1.5 sm:p-3 md:p-5">
            {/* Single Card Container for entire app */}
            <div className="bg-background rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden h-[calc(100vh-12px)] sm:h-[calc(100vh-24px)] md:h-[calc(100vh-40px)]">
                <div className="flex h-full">
                    {/* Desktop Sidebar - Inside the card */}
                    <div className="hidden md:block flex-shrink-0 border-r border-border">
                        <Sidebar />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header with breadcrumbs and search */}
                        <Header />
                        
                        {/* Page content */}
                        <main className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-3 sm:p-6 lg:p-8 pb-20 md:pb-8">
                                {children}
                            </div>
                        </main>
                    </div>

                    {/* Right Panel - Desktop Only - Inside the card */}
                    <div className="hidden xl:block flex-shrink-0 border-l border-border">
                        <RightPanel />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    );
}
