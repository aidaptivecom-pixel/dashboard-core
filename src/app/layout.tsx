import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FocusFlow - ADHD Productivity Dashboard",
    description: "A productivity dashboard designed for minds that think differently. Stay focused, capture ideas, and achieve your goals.",
    keywords: ["ADHD", "productivity", "focus", "task management", "time tracking"],
    authors: [{ name: "FocusFlow" }],
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f8f9fa" },
        { media: "(prefers-color-scheme: dark)", color: "#0f0f10" },
    ],
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
