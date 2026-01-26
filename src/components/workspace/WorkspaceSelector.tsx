"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Check } from "lucide-react";
import { useWorkspace, Workspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

export function WorkspaceSelector() {
    const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
                <div 
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                    style={{ backgroundColor: `${currentWorkspace.color}20` }}
                >
                    {currentWorkspace.icon}
                </div>
                <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold truncate">{currentWorkspace.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentWorkspace.description}</p>
                </div>
                <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        
                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 top-full mt-2 p-2 rounded-xl border border-border bg-background shadow-lg z-50"
                        >
                            <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Workspaces
                            </p>
                            
                            {workspaces.map((workspace) => (
                                <button
                                    key={workspace.id}
                                    onClick={() => {
                                        setCurrentWorkspace(workspace);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                                        currentWorkspace.id === workspace.id
                                            ? "bg-primary/10"
                                            : "hover:bg-accent"
                                    )}
                                >
                                    <div 
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                                        style={{ backgroundColor: `${workspace.color}20` }}
                                    >
                                        {workspace.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium">{workspace.name}</p>
                                    </div>
                                    {currentWorkspace.id === workspace.id && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </button>
                            ))}

                            <div className="border-t border-border mt-2 pt-2">
                                <button className="w-full flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm">Crear workspace</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
