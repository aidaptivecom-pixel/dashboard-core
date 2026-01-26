"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
                onClick={() => setLanguage("en")}
                className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all",
                    language === "en"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                <span className="text-sm">🇺🇸</span>
                EN
            </button>
            <button
                onClick={() => setLanguage("es")}
                className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all",
                    language === "es"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                <span className="text-sm">🇪🇸</span>
                ES
            </button>
        </div>
    );
}
