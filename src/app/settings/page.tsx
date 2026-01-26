"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Settings, User, Bell, Palette, Database, Keyboard, Sun, Moon, Monitor, Globe, ChevronDown, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const languages = [
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
];

const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
];

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState("es");

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Configuración</h1>
                    <p className="text-muted-foreground">Personaliza tu experiencia</p>
                </div>

                <div className="space-y-6">
                    {/* Appearance Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Palette className="h-5 w-5 text-purple" />
                            Apariencia
                        </h2>
                        
                        {/* Theme Selector */}
                        <div className="p-5 rounded-2xl border border-border bg-background">
                            <label className="text-sm font-medium mb-3 block">Tema</label>
                            <div className="grid grid-cols-3 gap-3">
                                {themes.map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTheme(t.value)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                            theme === t.value
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground/50"
                                        )}
                                    >
                                        <t.icon className={cn(
                                            "h-6 w-6",
                                            theme === t.value ? "text-primary" : "text-muted-foreground"
                                        )} />
                                        <span className="text-sm font-medium">{t.label}</span>
                                        {theme === t.value && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Selector */}
                        <div className="p-5 rounded-2xl border border-border bg-background">
                            <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Idioma
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                                            language === lang.code
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground/50"
                                        )}
                                    >
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="text-sm font-medium">{lang.label}</span>
                                        {language === lang.code && (
                                            <Check className="h-4 w-4 text-primary ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Profile */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Cuenta
                        </h2>
                        
                        <div className="p-5 rounded-2xl border border-border bg-background">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-coral to-purple flex items-center justify-center text-white font-bold text-xl">
                                    A
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">Alex</h3>
                                    <p className="text-sm text-muted-foreground">alex@example.com</p>
                                </div>
                                <button className="btn-secondary text-sm">Editar perfil</button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Bell className="h-5 w-5 text-coral" />
                            Notificaciones
                        </h2>
                        
                        <div className="p-5 rounded-2xl border border-border bg-background space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Recordatorios de tareas</p>
                                    <p className="text-sm text-muted-foreground">Recibe alertas antes de deadlines</p>
                                </div>
                                <button className="relative w-12 h-7 rounded-full bg-primary transition-colors">
                                    <span className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Resumen diario</p>
                                    <p className="text-sm text-muted-foreground">Email con tu progreso del día</p>
                                </div>
                                <button className="relative w-12 h-7 rounded-full bg-muted transition-colors">
                                    <span className="absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Alertas de errores</p>
                                    <p className="text-sm text-muted-foreground">Notificaciones de deploys fallidos</p>
                                </div>
                                <button className="relative w-12 h-7 rounded-full bg-primary transition-colors">
                                    <span className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Keyboard className="h-5 w-5 text-mint" />
                            Atajos de teclado
                        </h2>
                        
                        <div className="p-5 rounded-2xl border border-border bg-background">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Captura rápida</span>
                                    <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘ K</kbd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Buscar</span>
                                    <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘ /</kbd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Iniciar focus</span>
                                    <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘ F</kbd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Cerrar modal</span>
                                    <kbd className="px-2 py-1 text-xs bg-muted rounded">Esc</kbd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Database className="h-5 w-5 text-muted-foreground" />
                            Datos
                        </h2>
                        
                        <div className="p-5 rounded-2xl border border-border bg-background">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Exportar datos</p>
                                    <p className="text-sm text-muted-foreground">Descarga todas tus tareas y proyectos</p>
                                </div>
                                <button className="btn-secondary text-sm">Exportar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
