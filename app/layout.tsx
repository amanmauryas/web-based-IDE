"use client";

import './globals.css';
import type { Metadata } from 'next/types';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ReactGA from "react-ga4";

ReactGA.initialize("G-QPZYF9G3RE"); // Replace with your Measurement ID
ReactGA.send("pageview");

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Web IDE - Code Editor',
  description: 'A modern web-based IDE for all programming languages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
