import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import Header from "./components/Header";
import ThemeSwitch from "./components/themeSwitch";



export const metadata: Metadata = {
  title: "Mentor Verse",
  description: "Mentor Verse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <AuthProvider>
        <body
          className={cn(
            inter.className,
            "dark:bg-black dark:text-white min-h-screen flex flex-col"
          )}
        >
          <Providers>
            <Header />
            <ThemeSwitch />
            {/* Content Wrapper */}
            <main className="flex-grow py-4">{children}</main>
            <Footer />
          </Providers>
        </body>
      </AuthProvider>
    </html>
  );
}
