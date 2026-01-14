"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Header } from "@/components/Header";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 transition-colors`}
      >
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
      </body>
    </html>
  );
}
