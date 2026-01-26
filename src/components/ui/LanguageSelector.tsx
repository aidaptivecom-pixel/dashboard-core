"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
];

interface LanguageSelectorProps {
    compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("en");

    const currentLang = languages.find(l => l.code === selected);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 rounded-xl border border-border hover:bg-accent transition-colors",
                    compact ? "p-2.5" : "px-3 py-2"
                )}
            >
                <Globe className="h-4 w-4 text-muted-foreground" />
                {!compact && (
                    <span className="text-sm">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background shadow-lg z-50 overflow-hidden">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setSelected(lang.code);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-accent transition-colors",
                                    selected === lang.code && "bg-accent"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <span>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </span>
                                {selected === lang.code && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
