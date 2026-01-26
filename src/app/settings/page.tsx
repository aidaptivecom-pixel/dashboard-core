"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Settings, User, Bell, Palette, Database, Keyboard } from "lucide-react";

export default function SettingsPage() {
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Customize your experience</p>
                </div>

                <div className="space-y-4">
                    {/* Profile */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Profile</h3>
                                <p className="text-sm text-muted-foreground">Name, email, and avatar</p>
                            </div>
                            <button className="btn-secondary text-sm">Edit</button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10">
                                <Bell className="h-6 w-6 text-coral" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Notifications</h3>
                                <p className="text-sm text-muted-foreground">Reminders and alerts</p>
                            </div>
                            <button className="btn-secondary text-sm">Configure</button>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10">
                                <Palette className="h-6 w-6 text-purple" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Appearance</h3>
                                <p className="text-sm text-muted-foreground">Theme and display</p>
                            </div>
                            <button className="btn-secondary text-sm">Customize</button>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10">
                                <Keyboard className="h-6 w-6 text-mint" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Keyboard Shortcuts</h3>
                                <p className="text-sm text-muted-foreground">⌘K to capture, ESC to close</p>
                            </div>
                            <button className="btn-secondary text-sm">View All</button>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                                <Database className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Data & Sync</h3>
                                <p className="text-sm text-muted-foreground">Export and backup</p>
                            </div>
                            <button className="btn-secondary text-sm">Manage</button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
