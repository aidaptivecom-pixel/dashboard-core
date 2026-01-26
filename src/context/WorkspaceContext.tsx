"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Workspace {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
}

export const defaultWorkspaces: Workspace[] = [
    {
        id: "aidaptive",
        name: "Aidaptive",
        icon: "🤖",
        color: "#4F6BFF",
        description: "Automatización e IA",
    },
    {
        id: "igreen",
        name: "iGreen",
        icon: "🌱",
        color: "#10B981",
        description: "Proyecto sustentable",
    },
    {
        id: "personal",
        name: "Personal",
        icon: "👤",
        color: "#8B5CF6",
        description: "Tareas personales",
    },
];

interface WorkspaceContextType {
    workspaces: Workspace[];
    currentWorkspace: Workspace;
    setCurrentWorkspace: (workspace: Workspace) => void;
    addWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(defaultWorkspaces[0]);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("focusflow_workspace");
        if (saved) {
            const found = workspaces.find(w => w.id === saved);
            if (found) setCurrentWorkspace(found);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("focusflow_workspace", currentWorkspace.id);
    }, [currentWorkspace]);

    const addWorkspace = (workspace: Workspace) => {
        setWorkspaces([...workspaces, workspace]);
    };

    return (
        <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, setCurrentWorkspace, addWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error("useWorkspace must be used within WorkspaceProvider");
    }
    return context;
}
