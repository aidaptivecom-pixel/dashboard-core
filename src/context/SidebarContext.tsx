"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    spacesOpen: boolean;
    setSpacesOpen: (value: boolean) => void;
    aidaptiveCoreOpen: boolean;
    setAidaptiveCoreOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [spacesOpen, setSpacesOpen] = useState(true);
    const [aidaptiveCoreOpen, setAidaptiveCoreOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Recuperar estado de localStorage al montar
    useEffect(() => {
        const savedCollapsed = localStorage.getItem('sidebarCollapsed');
        const savedSpacesOpen = localStorage.getItem('sidebarSpacesOpen');
        const savedAidaptiveOpen = localStorage.getItem('aidaptiveCoreOpen');
        
        if (savedCollapsed !== null) setCollapsed(savedCollapsed === 'true');
        if (savedSpacesOpen !== null) setSpacesOpen(savedSpacesOpen === 'true');
        if (savedAidaptiveOpen !== null) setAidaptiveCoreOpen(savedAidaptiveOpen === 'true');
        
        setHydrated(true);
    }, []);

    // Persistir cambios
    useEffect(() => {
        if (hydrated) {
            localStorage.setItem('sidebarCollapsed', String(collapsed));
            localStorage.setItem('sidebarSpacesOpen', String(spacesOpen));
            localStorage.setItem('aidaptiveCoreOpen', String(aidaptiveCoreOpen));
        }
    }, [collapsed, spacesOpen, aidaptiveCoreOpen, hydrated]);

    return (
        <SidebarContext.Provider value={{
            collapsed,
            setCollapsed,
            spacesOpen,
            setSpacesOpen,
            aidaptiveCoreOpen,
            setAidaptiveCoreOpen,
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within SidebarProvider");
    }
    return context;
}
