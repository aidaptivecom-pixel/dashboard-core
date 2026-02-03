"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Settings, User, Bell, Palette, Database, Keyboard, Sun, Moon, Monitor, Globe, Check, Bot, MessageSquare, Clock, Zap, Shield, Trash2, Download, Upload, Link, Unlink, Smartphone, Camera,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const languages = [
    { code: "es", label: "Español", flag: "🇦🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
];

const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
];

const pomodoroPresets = [
    { focus: 25, shortBreak: 5, longBreak: 15, label: "Clásico" },
    { focus: 50, shortBreak: 10, longBreak: 30, label: "Deep Work" },
    { focus: 15, shortBreak: 3, longBreak: 10, label: "Corto" },
];

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
    return (
        <button onClick={() => onChange(!enabled)} className={cn("relative w-12 h-7 rounded-full transition-colors flex-shrink-0", enabled ? "bg-primary" : "bg-muted")}>
            <motion.span className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ left: enabled ? 26 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
        </button>
    );
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState("es");
    const [taskReminders, setTaskReminders] = useState(true);
    const [dailySummary, setDailySummary] = useState(false);
    const [focusAlerts, setFocusAlerts] = useState(true);
    const [clawdbotProactive, setClawdbotProactive] = useState(true);
    const [pomodoroPreset, setPomodoroPreset] = useState(0);
    const [customPomodoro, setCustomPomodoro] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
    const [autoStartBreaks, setAutoStartBreaks] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [telegramConnected, setTelegramConnected] = useState(true);
    const [whatsappConnected, setWhatsappConnected] = useState(false);

    const sections = [
        { id: "profile", label: "Perfil", icon: User, color: "text-primary" },
        { id: "appearance", label: "Apariencia", icon: Palette, color: "text-purple" },
        { id: "notifications", label: "Notificaciones", icon: Bell, color: "text-coral" },
        { id: "focus", label: "Modo Focus", icon: Clock, color: "text-mint" },
        { id: "clawdbot", label: "ClawdBot", icon: Bot, color: "text-yellow-500" },
        { id: "shortcuts", label: "Atajos", icon: Keyboard, color: "text-blue-500" },
        { id: "data", label: "Datos", icon: Database, color: "text-muted-foreground" },
    ];

    return (
        <>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div className="mb-6 sm:mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Settings className="h-7 w-7" />
                        Configuración
                    </h1>
                    <p className="text-muted-foreground text-sm">Personalizá tu experiencia en FocusFlow</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation - Hidden on mobile, horizontal scroll on tablet */}
                    <motion.nav className="lg:col-span-1 overflow-x-auto lg:overflow-x-visible" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0 pb-2 lg:pb-0">
                            {sections.map((section) => (
                                <a key={section.id} href={`#${section.id}`} className={cn("flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-all hover:bg-accent whitespace-nowrap")}>
                                    <section.icon className={cn("h-4 w-4 lg:h-5 lg:w-5", section.color)} />
                                    <span className="text-sm lg:text-base font-medium">{section.label}</span>
                                </a>
                            ))}
                        </div>
                    </motion.nav>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6 sm:space-y-8">
                        {/* Profile Section */}
                        <motion.section id="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><User className="h-5 w-5 text-primary" />Perfil</h2>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                    <div className="relative group">
                                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-coral to-purple flex items-center justify-center text-white font-bold text-2xl">A</div>
                                        <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="h-6 w-6 text-white" /></button>
                                    </div>
                                    <div className="flex-1 w-full space-y-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground">Nombre</label>
                                            <input type="text" defaultValue="Alex" className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Email</label>
                                            <input type="email" defaultValue="alex@aidaptive.com" className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Zona horaria</label>
                                            <select className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                                                <option>America/Argentina/Buenos_Aires (GMT-3)</option>
                                                <option>America/New_York (GMT-5)</option>
                                                <option>Europe/London (GMT+0)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border flex justify-end"><button className="btn-primary w-full sm:w-auto">Guardar cambios</button></div>
                            </div>
                        </motion.section>

                        {/* Appearance Section */}
                        <motion.section id="appearance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Palette className="h-5 w-5 text-purple" />Apariencia</h2>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background">
                                <label className="text-sm font-medium mb-4 block">Tema</label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {themes.map((t) => (
                                        <button key={t.value} onClick={() => setTheme(t.value)} className={cn("flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all", theme === t.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50")}>
                                            <t.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", theme === t.value ? "text-primary" : "text-muted-foreground")} />
                                            <span className="text-xs sm:text-sm font-medium">{t.label}</span>
                                            {theme === t.value && <Check className="h-4 w-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background">
                                <label className="text-sm font-medium mb-4 block flex items-center gap-2"><Globe className="h-4 w-4" />Idioma</label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {languages.map((lang) => (
                                        <button key={lang.code} onClick={() => setLanguage(lang.code)} className={cn("flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border-2 transition-all", language === lang.code ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50")}>
                                            <span className="text-lg sm:text-xl">{lang.flag}</span>
                                            <span className="text-xs sm:text-sm font-medium hidden sm:inline">{lang.label}</span>
                                            {language === lang.code && <Check className="h-4 w-4 text-primary ml-auto hidden sm:block" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Notifications Section */}
                        <motion.section id="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Bell className="h-5 w-5 text-coral" />Notificaciones</h2>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background space-y-4 sm:space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0"><p className="font-medium text-sm sm:text-base">Recordatorios de tareas</p><p className="text-xs sm:text-sm text-muted-foreground">Alertas antes de deadlines</p></div>
                                    <ToggleSwitch enabled={taskReminders} onChange={setTaskReminders} />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0"><p className="font-medium text-sm sm:text-base">Resumen diario</p><p className="text-xs sm:text-sm text-muted-foreground">Recibir resumen cada mañana</p></div>
                                    <ToggleSwitch enabled={dailySummary} onChange={setDailySummary} />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0"><p className="font-medium text-sm sm:text-base">Alertas de Focus</p><p className="text-xs sm:text-sm text-muted-foreground">Sonido al terminar pomodoro</p></div>
                                    <ToggleSwitch enabled={focusAlerts} onChange={setFocusAlerts} />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0"><p className="font-medium text-sm sm:text-base flex items-center gap-2"><Bot className="h-4 w-4 text-yellow-500" />ClawdBot proactivo</p><p className="text-xs sm:text-sm text-muted-foreground">Mensajes automáticos</p></div>
                                    <ToggleSwitch enabled={clawdbotProactive} onChange={setClawdbotProactive} />
                                </div>
                            </div>
                        </motion.section>

                        {/* Focus Mode Section */}
                        <motion.section id="focus" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5 text-mint" />Modo Focus</h2>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background space-y-4 sm:space-y-6">
                                <div>
                                    <label className="text-sm font-medium mb-3 block">Preset de tiempos</label>
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                        {pomodoroPresets.map((preset, index) => (
                                            <button key={index} onClick={() => { setPomodoroPreset(index); setCustomPomodoro(preset); }} className={cn("p-3 sm:p-4 rounded-xl border-2 transition-all text-left", pomodoroPreset === index ? "border-mint bg-mint/5" : "border-border hover:border-muted-foreground/50")}>
                                                <p className="font-medium text-sm sm:text-base">{preset.label}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{preset.focus}m / {preset.shortBreak}m / {preset.longBreak}m</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                    <div>
                                        <label className="text-xs sm:text-sm text-muted-foreground">Enfoque</label>
                                        <input type="number" value={customPomodoro.focus} onChange={(e) => setCustomPomodoro({...customPomodoro, focus: Number(e.target.value)})} className="w-full mt-1 px-3 sm:px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/20 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-muted-foreground">Corto</label>
                                        <input type="number" value={customPomodoro.shortBreak} onChange={(e) => setCustomPomodoro({...customPomodoro, shortBreak: Number(e.target.value)})} className="w-full mt-1 px-3 sm:px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/20 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-muted-foreground">Largo</label>
                                        <input type="number" value={customPomodoro.longBreak} onChange={(e) => setCustomPomodoro({...customPomodoro, longBreak: Number(e.target.value)})} className="w-full mt-1 px-3 sm:px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/20 text-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-border gap-4">
                                    <div className="min-w-0"><p className="font-medium text-sm sm:text-base">Auto-iniciar descansos</p><p className="text-xs sm:text-sm text-muted-foreground">Empezar descanso automáticamente</p></div>
                                    <ToggleSwitch enabled={autoStartBreaks} onChange={setAutoStartBreaks} />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0"><p className="font-medium text-sm sm:text-base">Sonidos</p><p className="text-xs sm:text-sm text-muted-foreground">Reproducir sonido al terminar</p></div>
                                    <ToggleSwitch enabled={soundEnabled} onChange={setSoundEnabled} />
                                </div>
                            </div>
                        </motion.section>

                        {/* ClawdBot Section */}
                        <motion.section id="clawdbot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Bot className="h-5 w-5 text-yellow-500" />ClawdBot</h2>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background space-y-4">
                                <p className="text-sm text-muted-foreground">Conectá tus apps de mensajería para interactuar con FocusFlow desde cualquier lugar.</p>
                                {/* Telegram */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#0088cc]/10"><MessageSquare className="h-5 w-5 text-[#0088cc]" /></div>
                                        <div><p className="font-medium">Telegram</p>{telegramConnected ? <p className="text-xs text-mint">Conectado como @alex_bot</p> : <p className="text-xs text-muted-foreground">No conectado</p>}</div>
                                    </div>
                                    {telegramConnected ? (
                                        <button onClick={() => setTelegramConnected(false)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-coral hover:bg-coral/10 transition-colors w-full sm:w-auto"><Unlink className="h-4 w-4" />Desconectar</button>
                                    ) : (
                                        <button onClick={() => setTelegramConnected(true)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm bg-[#0088cc] text-white hover:bg-[#0088cc]/90 transition-colors w-full sm:w-auto"><Link className="h-4 w-4" />Conectar</button>
                                    )}
                                </div>
                                {/* WhatsApp */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#25D366]/10"><Smartphone className="h-5 w-5 text-[#25D366]" /></div>
                                        <div><p className="font-medium">WhatsApp</p>{whatsappConnected ? <p className="text-xs text-mint">Conectado</p> : <p className="text-xs text-muted-foreground">No conectado</p>}</div>
                                    </div>
                                    {whatsappConnected ? (
                                        <button onClick={() => setWhatsappConnected(false)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-coral hover:bg-coral/10 transition-colors w-full sm:w-auto"><Unlink className="h-4 w-4" />Desconectar</button>
                                    ) : (
                                        <button onClick={() => setWhatsappConnected(true)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm bg-[#25D366] text-white hover:bg-[#25D366]/90 transition-colors w-full sm:w-auto"><Link className="h-4 w-4" />Conectar</button>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm font-medium mb-2">Comandos disponibles</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="p-2 rounded-lg bg-muted/30"><code className="text-primary text-xs">/captura</code><span className="text-muted-foreground ml-1 text-xs">Nueva idea</span></div>
                                        <div className="p-2 rounded-lg bg-muted/30"><code className="text-primary text-xs">/resumen</code><span className="text-muted-foreground ml-1 text-xs">Ver el día</span></div>
                                        <div className="p-2 rounded-lg bg-muted/30"><code className="text-primary text-xs">/tareas</code><span className="text-muted-foreground ml-1 text-xs">Pendientes</span></div>
                                        <div className="p-2 rounded-lg bg-muted/30"><code className="text-primary text-xs">/focus</code><span className="text-muted-foreground ml-1 text-xs">Timer</span></div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Shortcuts Section */}
                        <motion.section id="shortcuts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Keyboard className="h-5 w-5 text-blue-500" />Atajos de teclado</h2>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30"><span className="text-xs sm:text-sm">Búsqueda global</span><kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘ K</kbd></div>
                                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30"><span className="text-xs sm:text-sm">Captura rápida</span><kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘ N</kbd></div>
                                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30"><span className="text-xs sm:text-sm">Iniciar Focus</span><kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘ F</kbd></div>
                                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30"><span className="text-xs sm:text-sm">Modo oscuro</span><kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘ D</kbd></div>
                                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30"><span className="text-xs sm:text-sm">Ir a Calendario</span><kbd className="px-2 py-1 text-xs bg-background border border-border rounded">G C</kbd></div>
                                    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30"><span className="text-xs sm:text-sm">Cerrar modal</span><kbd className="px-2 py-1 text-xs bg-background border border-border rounded">Esc</kbd></div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Data Section */}
                        <motion.section id="data" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Database className="h-5 w-5 text-muted-foreground" />Datos</h2>
                            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-background space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3"><Download className="h-5 w-5 text-primary" /><div><p className="font-medium">Exportar datos</p><p className="text-sm text-muted-foreground">Descargá todo en JSON</p></div></div>
                                    <button className="btn-secondary text-sm w-full sm:w-auto">Exportar</button>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3"><Upload className="h-5 w-5 text-mint" /><div><p className="font-medium">Importar datos</p><p className="text-sm text-muted-foreground">Restaurar desde backup</p></div></div>
                                    <button className="btn-secondary text-sm w-full sm:w-auto">Importar</button>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border border-coral/30 bg-coral/5">
                                    <div className="flex items-center gap-3"><Trash2 className="h-5 w-5 text-coral" /><div><p className="font-medium text-coral">Eliminar cuenta</p><p className="text-sm text-muted-foreground">Esta acción es irreversible</p></div></div>
                                    <button className="px-4 py-2 rounded-xl border border-coral text-coral text-sm hover:bg-coral hover:text-white transition-colors w-full sm:w-auto">Eliminar</button>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </>
    );
}
