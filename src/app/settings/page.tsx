"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { 
    Settings, 
    User, 
    Bell, 
    Palette, 
    Database, 
    Keyboard, 
    Sun, 
    Moon, 
    Monitor, 
    Globe, 
    Check,
    Bot,
    MessageSquare,
    Clock,
    Zap,
    Shield,
    Trash2,
    Download,
    Upload,
    Link,
    Unlink,
    Smartphone,
    Mail,
    Camera,
    ChevronRight,
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

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (value: boolean) => void;
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
    return (
        <button 
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative w-12 h-7 rounded-full transition-colors",
                enabled ? "bg-primary" : "bg-muted"
            )}
        >
            <motion.span 
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ left: enabled ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    );
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState("es");
    const [activeSection, setActiveSection] = useState<string | null>(null);
    
    // Notifications
    const [taskReminders, setTaskReminders] = useState(true);
    const [dailySummary, setDailySummary] = useState(false);
    const [focusAlerts, setFocusAlerts] = useState(true);
    const [clawdbotProactive, setClawdbotProactive] = useState(true);
    
    // Pomodoro
    const [pomodoroPreset, setPomodoroPreset] = useState(0);
    const [customPomodoro, setCustomPomodoro] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
    const [autoStartBreaks, setAutoStartBreaks] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    // ClawdBot
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
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Settings className="h-7 w-7" />
                        Configuración
                    </h1>
                    <p className="text-muted-foreground">Personalizá tu experiencia en FocusFlow</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <motion.nav 
                        className="lg:col-span-1 space-y-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    "hover:bg-accent"
                                )}
                            >
                                <section.icon className={cn("h-5 w-5", section.color)} />
                                <span className="font-medium">{section.label}</span>
                            </a>
                        ))}
                    </motion.nav>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Profile Section */}
                        <motion.section 
                            id="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Perfil
                            </h2>
                            
                            <div className="p-6 rounded-2xl border border-border bg-background">
                                <div className="flex items-start gap-6">
                                    <div className="relative group">
                                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-coral to-purple flex items-center justify-center text-white font-bold text-2xl">
                                            A
                                        </div>
                                        <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="h-6 w-6 text-white" />
                                        </button>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground">Nombre</label>
                                            <input 
                                                type="text" 
                                                defaultValue="Alex"
                                                className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Email</label>
                                            <input 
                                                type="email" 
                                                defaultValue="alex@aidaptive.com"
                                                className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
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
                                <div className="mt-6 pt-4 border-t border-border flex justify-end">
                                    <button className="btn-primary">Guardar cambios</button>
                                </div>
                            </div>
                        </motion.section>

                        {/* Appearance Section */}
                        <motion.section 
                            id="appearance"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Palette className="h-5 w-5 text-purple" />
                                Apariencia
                            </h2>
                            
                            {/* Theme */}
                            <div className="p-6 rounded-2xl border border-border bg-background">
                                <label className="text-sm font-medium mb-4 block">Tema</label>
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

                            {/* Language */}
                            <div className="p-6 rounded-2xl border border-border bg-background">
                                <label className="text-sm font-medium mb-4 block flex items-center gap-2">
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
                        </motion.section>

                        {/* Notifications Section */}
                        <motion.section 
                            id="notifications"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Bell className="h-5 w-5 text-coral" />
                                Notificaciones
                            </h2>
                            
                            <div className="p-6 rounded-2xl border border-border bg-background space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Recordatorios de tareas</p>
                                        <p className="text-sm text-muted-foreground">Alertas antes de deadlines</p>
                                    </div>
                                    <ToggleSwitch enabled={taskReminders} onChange={setTaskReminders} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Resumen diario</p>
                                        <p className="text-sm text-muted-foreground">Recibir resumen cada mañana</p>
                                    </div>
                                    <ToggleSwitch enabled={dailySummary} onChange={setDailySummary} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Alertas de Focus</p>
                                        <p className="text-sm text-muted-foreground">Sonido al terminar pomodoro</p>
                                    </div>
                                    <ToggleSwitch enabled={focusAlerts} onChange={setFocusAlerts} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium flex items-center gap-2">
                                            <Bot className="h-4 w-4 text-yellow-500" />
                                            ClawdBot proactivo
                                        </p>
                                        <p className="text-sm text-muted-foreground">Mensajes automáticos y recordatorios</p>
                                    </div>
                                    <ToggleSwitch enabled={clawdbotProactive} onChange={setClawdbotProactive} />
                                </div>
                            </div>
                        </motion.section>

                        {/* Focus Mode Section */}
                        <motion.section 
                            id="focus"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-mint" />
                                Modo Focus
                            </h2>
                            
                            <div className="p-6 rounded-2xl border border-border bg-background space-y-6">
                                <div>
                                    <label className="text-sm font-medium mb-3 block">Preset de tiempos</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {pomodoroPresets.map((preset, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setPomodoroPreset(index);
                                                    setCustomPomodoro(preset);
                                                }}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 transition-all text-left",
                                                    pomodoroPreset === index
                                                        ? "border-mint bg-mint/5"
                                                        : "border-border hover:border-muted-foreground/50"
                                                )}
                                            >
                                                <p className="font-medium">{preset.label}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {preset.focus}m / {preset.shortBreak}m / {preset.longBreak}m
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground">Enfoque (min)</label>
                                        <input 
                                            type="number"
                                            value={customPomodoro.focus}
                                            onChange={(e) => setCustomPomodoro({...customPomodoro, focus: Number(e.target.value)})}
                                            className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground">Descanso corto</label>
                                        <input 
                                            type="number"
                                            value={customPomodoro.shortBreak}
                                            onChange={(e) => setCustomPomodoro({...customPomodoro, shortBreak: Number(e.target.value)})}
                                            className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground">Descanso largo</label>
                                        <input 
                                            type="number"
                                            value={customPomodoro.longBreak}
                                            onChange={(e) => setCustomPomodoro({...customPomodoro, longBreak: Number(e.target.value)})}
                                            className="w-full mt-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div>
                                        <p className="font-medium">Auto-iniciar descansos</p>
                                        <p className="text-sm text-muted-foreground">Empezar descanso automáticamente</p>
                                    </div>
                                    <ToggleSwitch enabled={autoStartBreaks} onChange={setAutoStartBreaks} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Sonidos</p>
                                        <p className="text-sm text-muted-foreground">Reproducir sonido al terminar</p>
                                    </div>
                                    <ToggleSwitch enabled={soundEnabled} onChange={setSoundEnabled} />
                                </div>
                            </div>
                        </motion.section>

                        {/* ClawdBot Section */}
                        <motion.section 
                            id="clawdbot"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Bot className="h-5 w-5 text-yellow-500" />
                                ClawdBot
                            </h2>
                            
                            <div className="p-6 rounded-2xl border border-border bg-background space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Conectá tus apps de mensajería para interactuar con FocusFlow desde cualquier lugar.
                                </p>

                                {/* Telegram */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#0088cc]/10">
                                            <MessageSquare className="h-5 w-5 text-[#0088cc]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Telegram</p>
                                            {telegramConnected ? (
                                                <p className="text-xs text-mint">Conectado como @alex_bot</p>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">No conectado</p>
                                            )}
                                        </div>
                                    </div>
                                    {telegramConnected ? (
                                        <button 
                                            onClick={() => setTelegramConnected(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-coral hover:bg-coral/10 transition-colors"
                                        >
                                            <Unlink className="h-4 w-4" />
                                            Desconectar
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => setTelegramConnected(true)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-[#0088cc] text-white hover:bg-[#0088cc]/90 transition-colors"
                                        >
                                            <Link className="h-4 w-4" />
                                            Conectar
                                        </button>
                                    )}
                                </div>

                                {/* WhatsApp */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#25D366]/10">
                                            <Smartphone className="h-5 w-5 text-[#25D366]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">WhatsApp</p>
                                            {whatsappConnected ? (
                                                <p className="text-xs text-mint">Conectado</p>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">No conectado</p>
                                            )}
                                        </div>
                                    </div>
                                    {whatsappConnected ? (
                                        <button 
                                            onClick={() => setWhatsappConnected(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-coral hover:bg-coral/10 transition-colors"
                                        >
                                            <Unlink className="h-4 w-4" />
                                            Desconectar
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => setWhatsappConnected(true)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-[#25D366] text-white hover:bg-[#25D366]/90 transition-colors"
                                        >
                                            <Link className="h-4 w-4" />
                                            Conectar
                                        </button>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm font-medium mb-2">Comandos disponibles</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="p-2 rounded-lg bg-muted/30">
                                            <code className="text-primary">/captura</code>
                                            <span className="text-muted-foreground ml-2">Nueva idea</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-muted/30">
                                            <code className="text-primary">/resumen</code>
                                            <span className="text-muted-foreground ml-2">Ver el día</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-muted/30">
                                            <code className="text-primary">/tareas</code>
                                            <span className="text-muted-foreground ml-2">Pendientes</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-muted/30">
                                            <code className="text-primary">/focus</code>
                                            <span className="text-muted-foreground ml-2">Iniciar timer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Shortcuts Section */}
                        <motion.section 
                            id="shortcuts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Keyboard className="h-5 w-5 text-blue-500" />
                                Atajos de teclado
                            </h2>
                            
                            <div className="p-6 rounded-2xl border border-border bg-background">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm">Búsqueda global</span>
                                        <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘ K</kbd>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm">Captura rápida</span>
                                        <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘ N</kbd>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm">Iniciar Focus</span>
                                        <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘ F</kbd>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm">Ir a Inicio</span>
                                        <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">G H</kbd>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm">Ir a Calendario</span>
                                        <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">G C</kbd>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm">Cerrar modal</span>
                                        <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">Esc</kbd>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Data Section */}
                        <motion.section 
                            id="data"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Database className="h-5 w-5 text-muted-foreground" />
                                Datos
                            </h2>
                            
                            <div className="p-6 rounded-2xl border border-border bg-background space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <Download className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-medium">Exportar datos</p>
                                            <p className="text-sm text-muted-foreground">Descargá todo en JSON</p>
                                        </div>
                                    </div>
                                    <button className="btn-secondary text-sm">Exportar</button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <Upload className="h-5 w-5 text-mint" />
                                        <div>
                                            <p className="font-medium">Importar datos</p>
                                            <p className="text-sm text-muted-foreground">Restaurar desde backup</p>
                                        </div>
                                    </div>
                                    <button className="btn-secondary text-sm">Importar</button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-coral/30 bg-coral/5">
                                    <div className="flex items-center gap-3">
                                        <Trash2 className="h-5 w-5 text-coral" />
                                        <div>
                                            <p className="font-medium text-coral">Eliminar cuenta</p>
                                            <p className="text-sm text-muted-foreground">Esta acción es irreversible</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 rounded-xl border border-coral text-coral text-sm hover:bg-coral hover:text-white transition-colors">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
