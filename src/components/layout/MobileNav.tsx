"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Inbox, Calendar, Target, Menu, MessageSquare, BarChart3, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
    { icon: Home, label: "Inicio", href: "/" },
    { icon: Inbox, label: "Captura", href: "/capture" },
    { icon: Calendar, label: "Calendario", href: "/calendar" },
    { icon: Target, label: "Objetivos", href: "/goals" },
];

const moreItems = [
    { icon: MessageSquare, label: "Inbox", href: "/inbox" },
    { icon: BarChart3, label: "Progreso", href: "/stats" },
    { icon: Settings, label: "Configuración", href: "/settings" },
];

export function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [showMore, setShowMore] = useState(false);

    const isMoreActive = moreItems.some((item) => pathname === item.href);

    const closeMenu = useCallback(() => setShowMore(false), []);

    // Close on route change
    useEffect(() => {
        closeMenu();
    }, [pathname, closeMenu]);

    return (
        <>
            {/* Bottom Sheet Overlay */}
            <AnimatePresence>
                {showMore && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={closeMenu}
                            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
                        >
                            <div className="bg-background border-t border-border rounded-t-2xl shadow-2xl">
                                {/* Handle bar */}
                                <div className="flex justify-center pt-3 pb-1">
                                    <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                                </div>

                                {/* Menu items */}
                                <div className="px-4 pb-4 pt-2 space-y-1">
                                    {moreItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <button
                                                key={item.href}
                                                onClick={() => {
                                                    router.push(item.href);
                                                    closeMenu();
                                                }}
                                                className={cn(
                                                    "flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-foreground hover:bg-accent active:bg-accent"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Spacer for the nav bar below */}
                                <div className="h-16" />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl safe-area-bottom">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
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
                                <item.icon
                                    className={cn(
                                        "h-5 w-5",
                                        isActive && "scale-110"
                                    )}
                                />
                                <span className="text-[10px] font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More button */}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={cn(
                            "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                            isMoreActive || showMore
                                ? "text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        {showMore ? (
                            <X className="h-5 w-5 scale-110" />
                        ) : (
                            <Menu
                                className={cn(
                                    "h-5 w-5",
                                    (isMoreActive || showMore) && "scale-110"
                                )}
                            />
                        )}
                        <span className="text-[10px] font-medium">Más</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
