import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({ select: { name: true } });
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error("Error fetching roles:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
