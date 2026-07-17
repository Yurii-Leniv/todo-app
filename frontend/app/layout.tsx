import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import UserInfo from "@/components/UserInfo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple multi-user todo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <header className="flex items-center justify-between border-b border-white/60 bg-white/70 px-8 py-5 shadow-sm backdrop-blur-md">
            <span className="text-xl font-extrabold tracking-tight text-indigo-950">
              Todo App
            </span>
            <UserInfo />
          </header>
          <main className="flex-1 px-6 py-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
