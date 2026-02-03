import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SidebarProvider } from "@/context/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FocusFlow - Tu Sistema Operativo Personal",
    description: "Organiza tu trabajo, captura ideas y alcanza tus objetivos. Un sistema personal para mentes que piensan diferente.",
    keywords: ["productividad", "organización", "tareas", "captura", "objetivos"],
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
        <html lang="es" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
