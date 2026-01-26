"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeHeader } from "@/components/widgets/WelcomeHeader";
import { FocusNowCard } from "@/components/widgets/FocusNowCard";
import { TodaysTasks } from "@/components/widgets/TodaysTasks";
import { EnergyCheckin } from "@/components/widgets/EnergyCheckin";
import { FocusStats } from "@/components/widgets/FocusStats";
import { InboxCounter } from "@/components/widgets/InboxCounter";
import { NextEvent } from "@/components/widgets/NextEvent";
import { QuickCaptureModal } from "@/components/modals/QuickCaptureModal";
import { FocusModeOverlay } from "@/components/modals/FocusModeOverlay";

export default function Home() {
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsCaptureOpen(true);
            }
            // Escape to close focus mode
            if (e.key === "Escape" && isFocusModeOpen) {
                setIsFocusModeOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFocusModeOpen]);

    return (
        <>
            <MainLayout>
                <div className="max-w-5xl mx-auto">
                    {/* Welcome Header */}
                    <WelcomeHeader
                        onOpenCapture={() => setIsCaptureOpen(true)}
                        onOpenSearch={() => setIsCaptureOpen(true)}
                    />

                    {/* Main Content - Simplified Layout */}
                    <div className="space-y-4 md:space-y-6">
                        
                        {/* Row 1: Focus Now Card - Hero */}
                        <FocusNowCard />

                        {/* Row 2: Energy + Focus Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EnergyCheckin />
                            <FocusStats onStartFocus={() => setIsFocusModeOpen(true)} />
                        </div>

                        {/* Row 3: Today's Tasks - Main List */}
                        <TodaysTasks />

                        {/* Row 4: Quick Info - Inbox + Next Event */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InboxCounter count={3} />
                            <NextEvent />
                        </div>
                    </div>
                </div>
            </MainLayout>

            {/* Modals */}
            <QuickCaptureModal
                isOpen={isCaptureOpen}
                onClose={() => setIsCaptureOpen(false)}
            />

            <FocusModeOverlay
                isOpen={isFocusModeOpen}
                onClose={() => setIsFocusModeOpen(false)}
            />
        </>
    );
}
