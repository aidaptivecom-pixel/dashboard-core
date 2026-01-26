"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeHeader } from "@/components/widgets/WelcomeHeader";
import { FocusNowCard } from "@/components/widgets/FocusNowCard";
import { TodaysTasks } from "@/components/widgets/TodaysTasks";
import { EnergyCheckin } from "@/components/widgets/EnergyCheckin";
import { FocusStats } from "@/components/widgets/FocusStats";
import { ProductivityTrends } from "@/components/widgets/ProductivityTrends";
import { ScreenTime } from "@/components/widgets/ScreenTime";
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
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <MainLayout>
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Header */}
                    <WelcomeHeader
                        onOpenCapture={() => setIsCaptureOpen(true)}
                        onOpenSearch={() => setIsCaptureOpen(true)}
                    />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Left Column */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Focus Now Card - Hero */}
                            <FocusNowCard />

                            {/* Today's Tasks */}
                            <TodaysTasks />

                            {/* Productivity Trends */}
                            <ProductivityTrends />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Energy Check-in */}
                            <EnergyCheckin />

                            {/* Focus Stats */}
                            <FocusStats />

                            {/* Screen Time */}
                            <ScreenTime />
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
