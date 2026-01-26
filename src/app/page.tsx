"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { DailyCheckin } from "@/components/flow/DailyCheckin";
import { DailyBriefing } from "@/components/flow/DailyBriefing";
import { DayPlan } from "@/components/flow/DayPlan";
import { QuickCaptureModal } from "@/components/modals/QuickCaptureModal";
import { FocusModeOverlay } from "@/components/modals/FocusModeOverlay";

type FlowStep = "checkin" | "briefing" | "plan";
type EnergyLevel = "low" | "medium" | "high";

export default function Home() {
    const [flowStep, setFlowStep] = useState<FlowStep>("checkin");
    const [energy, setEnergy] = useState<EnergyLevel>("medium");
    const [hours, setHours] = useState<number>(4);
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

    // Check if user already completed checkin today (localStorage)
    useEffect(() => {
        const today = new Date().toDateString();
        const savedCheckin = localStorage.getItem("focusflow_checkin");
        
        if (savedCheckin) {
            try {
                const data = JSON.parse(savedCheckin);
                if (data.date === today) {
                    setEnergy(data.energy);
                    setHours(data.hours);
                    setFlowStep("plan");
                }
            } catch (e) {
                // Invalid data, start fresh
            }
        }
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsCaptureOpen(true);
            }
            if (e.key === "Escape" && isFocusModeOpen) {
                setIsFocusModeOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFocusModeOpen]);

    const handleCheckinComplete = (selectedEnergy: EnergyLevel, selectedHours: number) => {
        setEnergy(selectedEnergy);
        setHours(selectedHours);
        
        // Save to localStorage
        const today = new Date().toDateString();
        localStorage.setItem("focusflow_checkin", JSON.stringify({
            date: today,
            energy: selectedEnergy,
            hours: selectedHours
        }));
        
        setFlowStep("briefing");
    };

    const handleBriefingComplete = () => {
        setFlowStep("plan");
    };

    // Reset checkin (for testing)
    const resetCheckin = () => {
        localStorage.removeItem("focusflow_checkin");
        setFlowStep("checkin");
    };

    return (
        <>
            <MainLayout>
                <AnimatePresence mode="wait">
                    {flowStep === "checkin" && (
                        <DailyCheckin 
                            key="checkin"
                            onComplete={handleCheckinComplete} 
                        />
                    )}
                    
                    {flowStep === "briefing" && (
                        <DailyBriefing 
                            key="briefing"
                            energy={energy}
                            hours={hours}
                            onContinue={handleBriefingComplete}
                        />
                    )}
                    
                    {flowStep === "plan" && (
                        <div key="plan" className="max-w-6xl mx-auto">
                            {/* Debug: Reset button */}
                            <button 
                                onClick={resetCheckin}
                                className="fixed bottom-4 right-4 z-50 px-3 py-1.5 text-xs bg-muted hover:bg-accent rounded-lg transition-colors"
                            >
                                Reset Check-in
                            </button>
                            
                            <DayPlan energy={energy} hours={hours} />
                        </div>
                    )}
                </AnimatePresence>
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
