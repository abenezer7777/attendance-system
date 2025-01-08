import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LoginPage from "@/components/auth/login-form";
export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/attendance");
  }

  return <LoginPage />;
}
