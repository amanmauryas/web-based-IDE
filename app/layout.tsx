
import './globals.css';
import type { Metadata } from 'next/types';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Analytics from "@/components/analytics";

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
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
