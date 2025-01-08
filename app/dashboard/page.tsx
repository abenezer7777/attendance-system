import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

import SignOut from "@/components/auth/sign-out";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SignOut />
      </div>
    </main>
  );
}
