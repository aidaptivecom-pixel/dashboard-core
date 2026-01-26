"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { DailyCheckIn } from "@/components/checkin/DailyCheckIn";
import { DailyBriefing } from "@/components/checkin/DailyBriefing";
import { DayPlanView } from "@/components/checkin/DayPlanView";
import { QuickCaptureModal } from "@/components/modals/QuickCaptureModal";
import { FocusModeOverlay } from "@/components/modals/FocusModeOverlay";
import { RotateCcw } from "lucide-react";

type FlowStep = "checkin" | "briefing" | "plan";
type EnergyLevel = "low" | "medium" | "high";

interface CheckInData {
    energy: EnergyLevel;
    hours: number;
    date: string;
}

export default function Home() {
    const [flowStep, setFlowStep] = useState<FlowStep>("checkin");
    const [checkInData, setCheckInData] = useState<CheckInData | null>(null);
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user already completed checkin today
    useEffect(() => {
        const today = new Date().toDateString();
        const saved = localStorage.getItem("focusflow_checkin");
        
        if (saved) {
            try {
                const data: CheckInData = JSON.parse(saved);
                if (data.date === today) {
                    setCheckInData(data);
                    setFlowStep("plan");
                }
            } catch (e) {
                localStorage.removeItem("focusflow_checkin");
            }
        }
        setIsLoading(false);
    }, []);

    // Keyboard shortcuts
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

    const handleCheckInComplete = (data: { energy: EnergyLevel; hours: number }) => {
        const today = new Date().toDateString();
        const checkIn: CheckInData = { ...data, date: today };
        
        localStorage.setItem("focusflow_checkin", JSON.stringify(checkIn));
        setCheckInData(checkIn);
        setFlowStep("briefing");
    };

    const handleBriefingComplete = () => {
        setFlowStep("plan");
    };

    const resetCheckIn = () => {
        localStorage.removeItem("focusflow_checkin");
        setCheckInData(null);
        setFlowStep("checkin");
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="min-h-[80vh] flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Cargando...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <>
            <MainLayout>
                <AnimatePresence mode="wait">
                    {flowStep === "checkin" && (
                        <motion.div
                            key="checkin"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <DailyCheckIn onComplete={handleCheckInComplete} />
                        </motion.div>
                    )}
                    
                    {flowStep === "briefing" && checkInData && (
                        <motion.div
                            key="briefing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <DailyBriefing 
                                data={checkInData}
                                onContinue={handleBriefingComplete}
                            />
                        </motion.div>
                    )}
                    
                    {flowStep === "plan" && checkInData && (
                        <motion.div
                            key="plan"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-6xl mx-auto"
                        >
                            <DayPlanView 
                                energy={checkInData.energy} 
                                hours={checkInData.hours} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reset button for testing */}
                {flowStep === "plan" && (
                    <button 
                        onClick={resetCheckIn}
                        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 text-xs bg-muted hover:bg-accent rounded-xl border border-border transition-colors shadow-sm"
                        title="Reiniciar check-in (para probar)"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                    </button>
                )}
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
