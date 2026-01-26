"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Zap, Rocket, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type EnergyLevel = "low" | "medium" | "high";
type WorkHours = 2 | 4 | 6 | 8;

interface CheckInData {
    energy: EnergyLevel;
    hours: WorkHours;
}

interface DailyCheckInProps {
    onComplete: (data: CheckInData) => void;
}

const energyOptions = [
    { value: "low" as EnergyLevel, icon: BatteryLow, label: "Baja", description: "Cansado, lento", color: "text-coral", bg: "bg-coral/10 hover:bg-coral/20 border-coral/20", activeBg: "bg-coral/20 border-coral" },
    { value: "medium" as EnergyLevel, icon: Zap, label: "Media", description: "Normal, estable", color: "text-yellow-500", bg: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20", activeBg: "bg-yellow-500/20 border-yellow-500" },
    { value: "high" as EnergyLevel, icon: Rocket, label: "Alta", description: "Energético, enfocado", color: "text-mint", bg: "bg-mint/10 hover:bg-mint/20 border-mint/20", activeBg: "bg-mint/20 border-mint" },
];

const hoursOptions: WorkHours[] = [2, 4, 6, 8];

export function DailyCheckIn({ onComplete }: DailyCheckInProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [energy, setEnergy] = useState<EnergyLevel | null>(null);
    const [hours, setHours] = useState<WorkHours | null>(null);

    const handleContinue = () => {
        if (step === 1 && energy) {
            setStep(2);
        } else if (step === 2 && energy && hours) {
            onComplete({ energy, hours });
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
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
                        {step === 1 ? (
                            <Battery className="h-8 w-8 text-primary" />
                        ) : (
                            <Clock className="h-8 w-8 text-primary" />
                        )}
                    </motion.div>
                    <h1 className="text-2xl font-bold mb-2">
                        {step === 1 ? "¿Cómo está tu energía?" : "¿Cuánto tiempo tienes hoy?"}
                    </h1>
                    <p className="text-muted-foreground">
                        {step === 1 
                            ? "Esto ayuda a priorizar tareas según tu estado actual"
                            : "Planificaré tu día con descansos incluidos"
                        }
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {energyOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setEnergy(option.value)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                                        energy === option.value ? option.activeBg : option.bg
                                    )}
                                >
                                    <div className={cn("p-3 rounded-xl", option.bg)}>
                                        <option.icon className={cn("h-6 w-6", option.color)} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-semibold">{option.label}</p>
                                        <p className="text-sm text-muted-foreground">{option.description}</p>
                                    </div>
                                    {energy === option.value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={cn("h-3 w-3 rounded-full", option.color.replace("text-", "bg-"))}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {hoursOptions.map((h) => (
                                <button
                                    key={h}
                                    onClick={() => setHours(h)}
                                    className={cn(
                                        "p-6 rounded-2xl border-2 transition-all text-center",
                                        hours === h 
                                            ? "bg-primary/10 border-primary" 
                                            : "bg-muted/50 border-transparent hover:bg-muted"
                                    )}
                                >
                                    <p className="text-3xl font-bold mb-1">{h}h</p>
                                    <p className="text-sm text-muted-foreground">
                                        {h <= 2 ? "Sesión corta" : h <= 4 ? "Media jornada" : h <= 6 ? "Día productivo" : "Jornada completa"}
                                    </p>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    className="mt-8 flex gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="btn-secondary flex-1 py-3"
                        >
                            Atrás
                        </button>
                    )}
                    <button
                        onClick={handleContinue}
                        disabled={(step === 1 && !energy) || (step === 2 && !hours)}
                        className={cn(
                            "btn-primary flex-1 py-3",
                            ((step === 1 && !energy) || (step === 2 && !hours)) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {step === 1 ? "Continuar" : "Ver mi plan"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                </motion.div>

                {/* Progress indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className={cn("h-2 w-8 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-2 w-8 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
                </div>
            </motion.div>
        </div>
    );
}
