import "./globals.css";
import type { Metadata } from "next/types";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Analytics from "@/components/analytics";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web IDE - Code Editor",
  description: "A modern web-based IDE for all programming languages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>Best Web IDE - Online Code Editor for Developers</title>
        <meta 
          name="description" 
          content="A powerful and feature-rich online web IDE for developers to write, run, and debug code in real-time. Supports multiple languages and collaboration." 
        />
        <meta 
          name="keywords" 
          content="online IDE, web IDE, online code editor, web-based code editor, online compiler, cloud IDE, online programming, online coding, real-time code editor, online text editor, online coding platform, cloud-based development, browser-based IDE, online Python compiler, JavaScript editor, C++ compiler online, HTML CSS editor, VS Code alternative, online development environment, cloud coding, remote development, code sharing, collaborative coding, online debugging tool, best web IDE, online software development, 
          Python, JavaScript, Java, C, C++, C#, PHP, Ruby, Swift, Kotlin, TypeScript, Go, Rust, Dart, R, MATLAB, Perl, Objective-C, Scala, Lua, Shell, Bash, PowerShell, HTML, CSS, SQL, NoSQL, GraphQL, JSON, YAML, XML, Assembly, COBOL, Fortran, Haskell, Lisp, Prolog, Julia, F#, Scheme, Groovy, Visual Basic, Pascal, Scratch, Solidity, OCaml" 
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
