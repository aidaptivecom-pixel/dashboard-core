// Task types
export interface Task {
    id: string;
    title: string;
    project: string;
    projectColor: string;
    estimatedMinutes: number;
    energyLevel: "low" | "medium" | "high";
    completed: boolean;
    dueDate?: string;
}

// Event types
export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    platform: "zoom" | "meet" | "teams" | "other";
}

// Insight types
export interface Insight {
    id: string;
    message: string;
    type: "productivity" | "deadline" | "inbox";
    icon: string;
}

// Chat message types
export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// Mock user data
export const mockUser = {
    name: "Alex",
    avatar: "/avatar.png",
    focusGoalHours: 6,
    focusCompletedHours: 4,
};

// Mock tasks
export const mockTasks: Task[] = [
    {
        id: "1",
        title: "Review Q1 marketing strategy",
        project: "Marketing",
        projectColor: "#4F6BFF",
        estimatedMinutes: 45,
        energyLevel: "high",
        completed: false,
    },
    {
        id: "2",
        title: "Reply to client emails",
        project: "Client Work",
        projectColor: "#FF6B6B",
        estimatedMinutes: 20,
        energyLevel: "low",
        completed: false,
    },
    {
        id: "3",
        title: "Update project documentation",
        project: "Engineering",
        projectColor: "#4ECDC4",
        estimatedMinutes: 30,
        energyLevel: "medium",
        completed: false,
    },
    {
        id: "4",
        title: "Prepare presentation slides",
        project: "Marketing",
        projectColor: "#4F6BFF",
        estimatedMinutes: 60,
        energyLevel: "high",
        completed: false,
    },
    {
        id: "5",
        title: "Team sync notes review",
        project: "Management",
        projectColor: "#A855F7",
        estimatedMinutes: 15,
        energyLevel: "low",
        completed: true,
    },
    {
        id: "6",
        title: "Research competitor analysis",
        project: "Strategy",
        projectColor: "#F59E0B",
        estimatedMinutes: 90,
        energyLevel: "high",
        completed: false,
    },
];

// Mock calendar events
export const mockEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "Daily Standup",
        date: "Today",
        time: "09:00 AM",
        platform: "meet",
    },
    {
        id: "2",
        title: "Design Review",
        date: "Today",
        time: "02:00 PM",
        platform: "zoom",
    },
    {
        id: "3",
        title: "Client Presentation",
        date: "Tomorrow",
        time: "10:30 AM",
        platform: "zoom",
    },
    {
        id: "4",
        title: "Sprint Planning",
        date: "Wed, Jan 28",
        time: "11:00 AM",
        platform: "teams",
    },
];

// Mock insights
export const mockInsights: Insight[] = [
    {
        id: "1",
        message: "You're most productive between 9-11am",
        type: "productivity",
        icon: "⚡",
    },
    {
        id: "2",
        message: "Project X deadline in 2 days",
        type: "deadline",
        icon: "📅",
    },
    {
        id: "3",
        message: "3 items in inbox need processing",
        type: "inbox",
        icon: "📥",
    },
];

// Mock focus data for charts
export const mockFocusData = [
    { time: "8am", focus: 0, scattered: 0 },
    { time: "9am", focus: 45, scattered: 15 },
    { time: "10am", focus: 50, scattered: 10 },
    { time: "11am", focus: 30, scattered: 30 },
    { time: "12pm", focus: 15, scattered: 20 },
    { time: "1pm", focus: 0, scattered: 0 },
    { time: "2pm", focus: 40, scattered: 20 },
    { time: "3pm", focus: 55, scattered: 5 },
    { time: "4pm", focus: 35, scattered: 25 },
];

// Mock screen time data
export const mockScreenTime = [
    { project: "Engineering", minutes: 120, color: "#4ECDC4" },
    { project: "Marketing", minutes: 85, color: "#4F6BFF" },
    { project: "Client Work", minutes: 45, color: "#FF6B6B" },
    { project: "Admin", minutes: 30, color: "#A855F7" },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
    {
        id: "1",
        role: "assistant",
        content: "Good morning! Based on your energy, I'd suggest starting with the marketing review. You're typically most focused before 11am.",
        timestamp: new Date(),
    },
];
