"use client";

import { motion } from "framer-motion";
import { Inbox, ArrowRight } from "lucide-react";
import Link from "next/link";

interface InboxCounterProps {
    count?: number;
}

export function InboxCounter({ count = 3 }: InboxCounterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4"
        >
            <Link href="/capture" className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10">
                        <Inbox className="h-5 w-5 text-coral" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Inbox</p>
                        <p className="text-xs text-muted-foreground">
                            {count > 0 ? `${count} items to process` : "All clear!"}
                        </p>
                    </div>
                </div>
                
                {count > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral text-white text-xs font-bold">
                            {count}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                )}
            </Link>
        </motion.div>
    );
}
