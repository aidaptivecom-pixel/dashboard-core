"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mic,
    Paperclip,
    FolderKanban,
    CheckSquare,
    Inbox,
    Command,
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const projects = [
    { id: "1", name: "Marketing", color: "#4F6BFF" },
    { id: "2", name: "Engineering", color: "#4ECDC4" },
    { id: "3", name: "Client Work", color: "#FF6B6B" },
    { id: "4", name: "Personal", color: "#A855F7" },
];

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"capture" | "task">("capture");
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Open with Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                // Toggle handled by parent
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101]"
                    >
                        <div className="glass-card p-0 overflow-hidden mx-4">
                            {/* Search/Input Header */}
                            <div className="flex items-center gap-3 p-4 border-b border-border">
                                <Search className="h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Quick capture or search..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    autoFocus
                                    className="flex-1 bg-transparent text-lg focus:outline-none placeholder:text-muted-foreground"
                                />
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Mode Toggle */}
                            <div className="flex gap-1 p-2 mx-4 mt-4 bg-muted rounded-lg">
                                <button
                                    onClick={() => setMode("capture")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                                        mode === "capture"
                                            ? "bg-background shadow-sm"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <Inbox className="h-4 w-4" />
                                    Just Capture
                                </button>
                                <button
                                    onClick={() => setMode("task")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                                        mode === "task"
                                            ? "bg-background shadow-sm"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <CheckSquare className="h-4 w-4" />
                                    Create Task
                                </button>
                            </div>

                            {/* Voice Recording */}
                            <div className="p-4">
                                <button
                                    onClick={() => setIsRecording(!isRecording)}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all",
                                        isRecording
                                            ? "border-coral bg-coral/10"
                                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                                    )}
                                >
                                    <Mic
                                        className={cn(
                                            "h-5 w-5",
                                            isRecording ? "text-coral animate-pulse" : "text-muted-foreground"
                                        )}
                                    />
                                    <span className="text-sm">
                                        {isRecording ? "Recording... Click to stop" : "Click to record voice note"}
                                    </span>
                                </button>

                                {/* Waveform placeholder */}
                                {isRecording && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="flex items-center justify-center gap-1 mt-4 h-12"
                                    >
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: [8, 24, 8],
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.5,
                                                    delay: i * 0.05,
                                                }}
                                                className="w-1 bg-coral rounded-full"
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            {/* Project Selection (for task mode) */}
                            {mode === "task" && (
                                <div className="px-4 pb-4">
                                    <label className="text-xs text-muted-foreground mb-2 block">
                                        Assign to project
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {projects.map((project) => (
                                            <button
                                                key={project.id}
                                                onClick={() =>
                                                    setSelectedProject(
                                                        selectedProject === project.id ? null : project.id
                                                    )
                                                }
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
                                                    selectedProject === project.id
                                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                                        : "bg-muted hover:bg-accent"
                                                )}
                                            >
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: project.color }}
                                                />
                                                {project.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted rounded">
                                        ESC to close
                                    </kbd>
                                    <button
                                        onClick={() => {
                                            // Handle save
                                            onClose();
                                        }}
                                        disabled={!input.trim()}
                                        className="btn-primary"
                                    >
                                        {mode === "capture" ? "Capture" : "Create Task"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
