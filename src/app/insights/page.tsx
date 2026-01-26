"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { BarChart3, TrendingUp, Clock, Brain } from "lucide-react";
import { ProductivityTrends } from "@/components/widgets/ProductivityTrends";
import { ScreenTime } from "@/components/widgets/ScreenTime";

export default function InsightsPage() {
    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Insights</h1>
                        <p className="text-muted-foreground">Understand your productivity patterns</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Focus Time</span>
                        </div>
                        <p className="text-2xl font-bold">24h</p>
                        <p className="text-xs text-mint">+12% this week</p>
                    </div>
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-mint" />
                            <span className="text-xs text-muted-foreground">Tasks Done</span>
                        </div>
                        <p className="text-2xl font-bold">47</p>
                        <p className="text-xs text-mint">+8% this week</p>
                    </div>
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-purple" />
                            <span className="text-xs text-muted-foreground">Best Hour</span>
                        </div>
                        <p className="text-2xl font-bold">9 AM</p>
                        <p className="text-xs text-muted-foreground">Peak focus</p>
                    </div>
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-coral" />
                            <span className="text-xs text-muted-foreground">Avg Energy</span>
                        </div>
                        <p className="text-2xl font-bold">Medium</p>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProductivityTrends />
                    <ScreenTime />
                </div>
            </div>
        </MainLayout>
    );
}
