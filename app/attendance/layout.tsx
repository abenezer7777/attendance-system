"use client";

import { useEffect } from "react";

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Run auto-checkout check every minute
    const interval = setInterval(async () => {
      try {
        await fetch("/api/attendance/auto-checkout", {
          method: "POST",
        });
      } catch (error) {
        console.error("Auto-checkout check failed:", error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
