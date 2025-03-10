import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/attendance");
  } else {
    redirect("/login");
  }

  // return <LoginPage />;
}
