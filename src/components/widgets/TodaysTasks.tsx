"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Check, GripVertical, Plus, Clock } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { mockTasks, Task } from "@/lib/mock-data";

type FilterType = "all" | "high" | "low";

export function TodaysTasks() {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [filter, setFilter] = useState<FilterType>("all");
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const filteredTasks = tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "high") return task.energyLevel === "high";
        if (filter === "low") return task.energyLevel === "low";
        return true;
    });

    const toggleTask = (id: string) => {
        setTasks(
            tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            project: "Inbox",
            projectColor: "#6B7280",
            estimatedMinutes: 15,
            energyLevel: "medium",
            completed: false,
        };
        setTasks([...tasks, newTask]);
        setNewTaskTitle("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Today&apos;s Tasks</h3>
                <span className="text-sm text-muted-foreground">
                    {tasks.filter((t) => t.completed).length}/{tasks.length} done
                </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
                {(["all", "high", "low"] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            filter === f
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {f === "all" ? "All" : f === "high" ? "🚀 High" : "🔋 Low"}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <Reorder.Group
                axis="y"
                values={filteredTasks}
                onReorder={(newOrder) => {
                    const otherTasks = tasks.filter(
                        (t) => !newOrder.find((nt) => nt.id === t.id)
                    );
                    setTasks([...newOrder, ...otherTasks]);
                }}
                className="space-y-1"
            >
                {filteredTasks.slice(0, 6).map((task) => (
                    <Reorder.Item
                        key={task.id}
                        value={task}
                        className={cn(
                            "task-item group",
                            task.completed && "opacity-50"
                        )}
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

                        <button
                            onClick={() => toggleTask(task.id)}
                            className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all flex-shrink-0",
                                task.completed
                                    ? "bg-primary border-primary"
                                    : "border-border hover:border-primary"
                            )}
                        >
                            {task.completed && <Check className="h-3 w-3 text-white" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <p
                                className={cn(
                                    "text-sm truncate",
                                    task.completed && "line-through text-muted-foreground"
                                )}
                            >
                                {task.title}
                            </p>
                        </div>

                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: task.projectColor }}
                        />

                        <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatTime(task.estimatedMinutes)}
                        </span>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {/* Add Task Input */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Add a task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                />
            </div>
        </motion.div>
    );
}
