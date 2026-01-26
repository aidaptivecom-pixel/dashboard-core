"use client";

import { Home, FolderKanban, Plus, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Home, label: "Home", href: "/", active: true },
    { icon: FolderKanban, label: "Projects", href: "/projects" },
    { icon: Plus, label: "Capture", href: "#capture", isAction: true },
    { icon: BarChart3, label: "Insights", href: "/insights" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                            item.isAction
                                ? "relative -mt-6"
                                : item.active
                                    ? "text-primary"
                                    : "text-muted-foreground"
                        )}
                    >
                        {item.isAction ? (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple shadow-lg">
                                <item.icon className="h-6 w-6 text-white" />
                            </div>
                        ) : (
                            <>
                                <item.icon className="h-5 w-5" />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </>
                        )}
                    </a>
                ))}
            </div>
        </nav>
    );
}
