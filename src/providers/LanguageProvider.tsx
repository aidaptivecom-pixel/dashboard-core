"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es";

interface Translations {
    [key: string]: {
        en: string;
        es: string;
    };
}

// Translations dictionary
export const translations: Translations = {
    // General
    "welcome.morning": { en: "Good morning", es: "Buenos días" },
    "welcome.afternoon": { en: "Good afternoon", es: "Buenas tardes" },
    "welcome.evening": { en: "Good evening", es: "Buenas noches" },
    "search.placeholder": { en: "Search...", es: "Buscar..." },
    "capture": { en: "Capture", es: "Capturar" },
    
    // Sidebar
    "nav.home": { en: "Home", es: "Inicio" },
    "nav.projects": { en: "Projects", es: "Proyectos" },
    "nav.capture": { en: "Capture Vault", es: "Bóveda" },
    "nav.insights": { en: "Insights", es: "Análisis" },
    "nav.settings": { en: "Settings", es: "Ajustes" },
    
    // Focus Now
    "focus.now": { en: "Focus Now", es: "Enfócate Ahora" },
    "focus.why": { en: "Why this task?", es: "¿Por qué esta tarea?" },
    "focus.complete": { en: "Complete", es: "Completar" },
    "focus.start": { en: "Start Focus Session", es: "Iniciar Sesión de Enfoque" },
    
    // Energy
    "energy.title": { en: "How's your energy?", es: "¿Cómo está tu energía?" },
    "energy.subtitle": { en: "This helps prioritize your tasks", es: "Esto ayuda a priorizar tus tareas" },
    "energy.low": { en: "Low", es: "Baja" },
    "energy.medium": { en: "Medium", es: "Media" },
    "energy.high": { en: "High", es: "Alta" },
    
    // Tasks
    "tasks.today": { en: "Today's Tasks", es: "Tareas de Hoy" },
    "tasks.done": { en: "done", es: "hechas" },
    "tasks.all": { en: "All", es: "Todas" },
    "tasks.add": { en: "Add a task...", es: "Agregar tarea..." },
    
    // Focus Stats
    "stats.title": { en: "Focus Stats", es: "Estadísticas" },
    "stats.daily": { en: "Daily progress", es: "Progreso diario" },
    "stats.periods": { en: "Today's focus periods", es: "Períodos de enfoque hoy" },
    
    // Inbox
    "inbox.title": { en: "Inbox", es: "Bandeja" },
    "inbox.items": { en: "items to process", es: "elementos por procesar" },
    "inbox.clear": { en: "All clear!", es: "¡Todo listo!" },
    
    // Upcoming
    "upcoming.title": { en: "Upcoming", es: "Próximos" },
    "upcoming.seeAll": { en: "See all", es: "Ver todos" },
    "upcoming.today": { en: "Today", es: "Hoy" },
    "upcoming.tomorrow": { en: "Tomorrow", es: "Mañana" },
    
    // Claude AI
    "claude.title": { en: "Claude AI", es: "Claude AI" },
    "claude.subtitle": { en: "Your focus assistant", es: "Tu asistente de enfoque" },
    "claude.placeholder": { en: "Ask Claude...", es: "Pregunta a Claude..." },
    "claude.thinking": { en: "Claude is thinking...", es: "Claude está pensando..." },
    
    // Quick Insights
    "insights.title": { en: "Quick Insights", es: "Insights Rápidos" },
    "insights.productive": { en: "You're most productive between 9-11am", es: "Eres más productivo entre 9-11am" },
    "insights.deadline": { en: "Project X deadline in 2 days", es: "Fecha límite Proyecto X en 2 días" },
    "insights.inbox": { en: "3 items in inbox need processing", es: "3 elementos en bandeja por procesar" },
    
    // Capture Modal
    "capture.quick": { en: "Quick capture or search...", es: "Captura rápida o buscar..." },
    "capture.just": { en: "Just Capture", es: "Solo Capturar" },
    "capture.task": { en: "Create Task", es: "Crear Tarea" },
    "capture.record": { en: "Click to record voice note", es: "Clic para grabar nota de voz" },
    "capture.recording": { en: "Recording... Click to stop", es: "Grabando... Clic para detener" },
    "capture.project": { en: "Assign to project", es: "Asignar a proyecto" },
    
    // Settings
    "settings.title": { en: "Settings", es: "Ajustes" },
    "settings.language": { en: "Language", es: "Idioma" },
    "settings.theme": { en: "Appearance", es: "Apariencia" },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Load saved language on mount
    useEffect(() => {
        const saved = localStorage.getItem("language") as Language;
        if (saved && (saved === "en" || saved === "es")) {
            setLanguage(saved);
        }
    }, []);

    // Save language when it changes
    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const t = (key: string): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }
        return translation[language];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
