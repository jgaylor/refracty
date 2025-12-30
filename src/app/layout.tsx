import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { InsightCapture } from "@/components/InsightCapture";
import { ToasterWrapper } from "@/components/ToasterWrapper";
import { getUser } from "@/lib/supabase/auth";
import { getUserProfile } from "@/lib/supabase/profile";
import { getThemeScript } from "./theme-script";

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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:28',message:'RootLayout render start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const user = await getUser();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:31',message:'After getUser',data:{hasUser:!!user,isLoggedIn:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const isLoggedIn = !!user;
  let profile = null;
  try {
    profile = isLoggedIn ? await getUserProfile() : null;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:36',message:'After getUserProfile',data:{hasProfile:!!profile,appearance:profile?.appearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:40',message:'Error in getUserProfile',data:{errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    // Gracefully handle error - app should still work without profile
    profile = null;
  }

  const themeScript = getThemeScript();
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:55',message:'Rendering layout with theme script',data:{hasProfile:!!profile,appearance:profile?.appearance,scriptLength:themeScript.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'J'})}).catch(()=>{});
  // #endregion
  
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full flex flex-col`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider initialAppearance={profile?.appearance}>
          <ToasterWrapper />
          <Header />
          {isLoggedIn ? (
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <main className="flex-1 min-w-0 pt-8 pb-32 overflow-auto [scrollbar-gutter:stable]">
                {children}
                <InsightCapture />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
