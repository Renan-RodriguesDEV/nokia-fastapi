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
  const isRegisterPage = pathname === "/register";
  const isForgotPasswordPage = pathname === "/forgot-password";

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white transition-colors`}
      >
        <NotificationProvider>
          {!isLoginPage && !isRegisterPage && !isForgotPasswordPage && (
            <Header />
          )}
          {!isLoginPage && !isRegisterPage && !isForgotPasswordPage && (
            <Sidebar />
          )}
          <main
            className={`min-h-screen transition-all duration-300 ${
              !isLoginPage && !isRegisterPage && !isForgotPasswordPage
                ? "sm:ml-20"
                : ""
            } pt-2 sm:pt-4 px-4 sm:px-6`}
          >
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
