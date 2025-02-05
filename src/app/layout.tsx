import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";
import { Providers } from "./providers"; 
import { cn } from "@/lib/utils";
import Header from "./components/Header";
import ThemeSwitch from "./components/themeSwitch";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mentor Verse",
  description: "Mentor Verse",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={cn(inter.className, "dark:bg-black dark:text-white min-h-screen flex flex-col")}>
        <Providers>
          <AuthProvider> {/* ✅ Make sure it's inside Providers */}
            <Header />
            <div className="flex items-center justify-end space-x-4 px-6 py-2">
              <ThemeSwitch />
            </div>
            <main className="flex-grow py-4">{children}</main>
            <Toaster />
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
