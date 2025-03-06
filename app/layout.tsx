import "./globals.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";
import AppProviders from "./app-providers";
import AbilityProvider from "@/components/casl/AbilityProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthWatcher from "@/components/AuthWatcher";
// import url("https://unpkg.com/leaflet/dist/leaflet.css");
// app/layout.tsx

const inter = Inter({
  subsets: ["latin"], // Specify the subset explicitly
  display: "swap", // Optional: Improve font loading performance
});

export const metadata: Metadata = {
  title: "Attendance System",
  description: "Geofenced attendance tracking system",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        {/* fit the content to the current device and avoid pushing effect of absolutely positioned element like drop down menu */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders session={session}>
            <AuthWatcher />
            <AbilityProvider>
              <main className="flex-1 h-screen">{children}</main>
            </AbilityProvider>
            <Toaster />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
