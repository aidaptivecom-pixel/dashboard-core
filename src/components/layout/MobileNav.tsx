"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Inbox, Calendar, Target, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Home, label: "Inicio", href: "/" },
    { icon: Inbox, label: "Captura", href: "/capture" },
    { icon: Calendar, label: "Calendario", href: "/calendar" },
    { icon: Target, label: "Objetivos", href: "/goals" },
    { icon: Menu, label: "Más", href: "/settings" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || 
                        (item.href === "/capture" && pathname === "/capture") ||
                        (item.href === "/" && pathname === "/");
                    
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5",
                                isActive && "scale-110"
                            )} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
