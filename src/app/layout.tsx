import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { getUser } from "@/lib/supabase/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Refracty",
  description: "Refracty application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const isLoggedIn = !!user;

  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full flex flex-col bg-neutral-50 text-neutral-900`}>
        <Header />
        {isLoggedIn ? (
          <div className="flex flex-1 min-h-0">
            <Sidebar />
            <main className="flex-1 min-w-0 pt-8 pb-16 overflow-auto">
              {children}
            </main>
          </div>
        ) : (
          <>
            <div className="pt-32 pb-16">
              {children}
            </div>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
