import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SidebarProvider } from "@/context/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Aidaptive Hub",
    description: "Tu sistema operativo personal - Finanzas, proyectos y más",
    keywords: ["productividad", "finanzas", "organización", "tareas"],
    authors: [{ name: "Aidaptive" }],
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    themeColor: "#0f0f10",
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        apple: "/icons/apple-icon.png",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Hub",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className={inter.className}>
                <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
                <ThemeProvider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
