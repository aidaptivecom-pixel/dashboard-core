"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Zap, Rocket, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type EnergyLevel = "low" | "medium" | "high";
type WorkHours = 2 | 4 | 6 | 8;

interface DailyCheckinProps {
    onComplete: (energy: EnergyLevel, hours: WorkHours) => void;
}

const energyOptions = [
    { 
        level: "low" as EnergyLevel, 
        icon: BatteryLow, 
        label: "Baja", 
        emoji: "🔋",
        description: "Cansado, difícil concentrarse",
        color: "border-coral text-coral bg-coral/10"
    },
    { 
        level: "medium" as EnergyLevel, 
        icon: BatteryMedium, 
        label: "Media", 
        emoji: "⚡",
        description: "Normal, puedo trabajar",
        color: "border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10"
    },
    { 
        level: "high" as EnergyLevel, 
        icon: BatteryFull, 
        label: "Alta", 
        emoji: "🚀",
        description: "Energizado, listo para todo",
        color: "border-mint text-mint-dark bg-mint/10"
    },
];

const hoursOptions: WorkHours[] = [2, 4, 6, 8];

export function DailyCheckin({ onComplete }: DailyCheckinProps) {
    const [energy, setEnergy] = useState<EnergyLevel | null>(null);
    const [hours, setHours] = useState<WorkHours | null>(null);
    const [step, setStep] = useState(1);

    const handleContinue = () => {
        if (step === 1 && energy) {
            setStep(2);
        } else if (step === 2 && energy && hours) {
            onComplete(energy, hours);
        }
    };

    const canContinue = step === 1 ? energy !== null : hours !== null;

    return (
        <div className="min-h-full flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4"
                    >
                        <Zap className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h1 className="text-2xl font-bold mb-2">Buenos días</h1>
                    <p className="text-muted-foreground">Antes de empezar, cuéntame cómo estás</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold text-center mb-4">¿Cómo está tu energía hoy?</h2>
                            
                            <div className="grid grid-cols-3 gap-3">
                                {energyOptions.map((option) => (
                                    <button
                                        key={option.level}
                                        onClick={() => setEnergy(option.level)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                            energy === option.level
                                                ? option.color + " border-current"
                                                : "border-border hover:border-muted-foreground/50 bg-background"
                                        )}
                                    >
                                        <span className="text-3xl">{option.emoji}</span>
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-[10px] text-muted-foreground text-center leading-tight">
                                            {option.description}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold text-center mb-4">¿Cuántas horas puedes trabajar hoy?</h2>
                            
                            <div className="grid grid-cols-4 gap-3">
                                {hoursOptions.map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => setHours(h)}
                                        className={cn(
                                            "flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all",
                                            hours === h
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-muted-foreground/50 bg-background"
                                        )}
                                    >
                                        <Clock className="h-5 w-5 mb-1" />
                                        <span className="text-2xl font-bold">{h}</span>
                                        <span className="text-xs text-muted-foreground">horas</span>
                                    </button>
                                ))}
                            </div>

                            {energy && (
                                <p className="text-sm text-center text-muted-foreground mt-4">
                                    Con energía {energy === "low" ? "baja" : energy === "medium" ? "media" : "alta"}, 
                                    te recomiendo bloques de {energy === "low" ? "25" : energy === "medium" ? "45" : "60"} minutos
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={handleContinue}
                        disabled={!canContinue}
                        className={cn(
                            "w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all",
                            canContinue
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        {step === 1 ? "Continuar" : "Ver mi plan del día"}
                        <ArrowRight className="h-4 w-4" />
                    </button>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={cn("h-2 w-2 rounded-full", step >= 1 ? "bg-primary" : "bg-muted")} />
                        <div className={cn("h-2 w-2 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
