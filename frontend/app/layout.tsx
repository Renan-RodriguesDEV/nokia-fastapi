"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Header } from "@/components/Header";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `const savedTheme = localStorage.getItem('theme'); const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark); if (isDark) document.documentElement.classList.add('dark');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 transition-colors`}
      >
        <ThemeProvider>
          <NotificationProvider>
            {!isLoginPage && <Header />}
            {!isLoginPage && <Sidebar />}
            <main
              className={`transition-all duration-300 ${
                !isLoginPage ? "ml-20" : ""
              }`}
            >
              {children}
            </main>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
