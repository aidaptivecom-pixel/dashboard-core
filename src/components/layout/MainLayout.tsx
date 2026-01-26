"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { MobileNav } from "./MobileNav";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:ml-[240px] xl:mr-80 2xl:mr-96 min-h-screen transition-all duration-300">
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>

            {/* Right Panel - Desktop Only */}
            <div className="hidden xl:block fixed right-0 top-0 h-screen">
                <RightPanel />
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    );
}
