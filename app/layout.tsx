import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"], // Specify the subset explicitly
  display: "swap", // Optional: Improve font loading performance
});

export const metadata: Metadata = {
  title: "Attendance System",
  description: "Geofenced attendance tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <SessionProvider>
            <QueryProvider>
              {/* <Navbar /> */}
              {children}
              <Toaster />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
