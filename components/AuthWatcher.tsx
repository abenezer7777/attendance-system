// components/AuthWatcher.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthWatcher() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect the user to the login page when the session ends
      router.push("/login");
    }
  }, [status, router]);

  return null;
}
