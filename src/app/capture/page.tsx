"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Inbox, Upload, Image, FileText, Link2, Mic } from "lucide-react";

export default function CapturePage() {
    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Capture Vault</h1>
                        <p className="text-muted-foreground">Screenshots, ideas, links, and more</p>
                    </div>
                </div>

                {/* Quick Capture Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <button className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-accent/50 transition-colors">
                        <Image className="h-6 w-6 text-coral" />
                        <span className="text-sm font-medium">Screenshot</span>
                    </button>
                    <button className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-accent/50 transition-colors">
                        <FileText className="h-6 w-6 text-mint" />
                        <span className="text-sm font-medium">Note</span>
                    </button>
                    <button className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-accent/50 transition-colors">
                        <Link2 className="h-6 w-6 text-primary" />
                        <span className="text-sm font-medium">Link</span>
                    </button>
                    <button className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-accent/50 transition-colors">
                        <Mic className="h-6 w-6 text-purple" />
                        <span className="text-sm font-medium">Voice</span>
                    </button>
                </div>

                {/* Empty State */}
                <div className="glass-card p-12 text-center border-2 border-dashed border-border">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral/10 mx-auto mb-4">
                        <Inbox className="h-8 w-8 text-coral" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Your vault is empty</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                        Drop screenshots, save links, record voice notes, or jot down ideas. 
                        Claude will help you organize and find them later.
                    </p>
                    <button className="btn-primary">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
