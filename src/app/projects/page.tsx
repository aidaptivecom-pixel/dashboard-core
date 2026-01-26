"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { FolderKanban, Plus } from "lucide-react";

export default function ProjectsPage() {
    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Projects</h1>
                        <p className="text-muted-foreground">Organize your work by project</p>
                    </div>
                    <button className="btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </button>
                </div>

                {/* Empty State */}
                <div className="glass-card p-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                        <FolderKanban className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No projects yet</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                        Create your first project to start organizing tasks, documents, and resources.
                    </p>
                    <button className="btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
