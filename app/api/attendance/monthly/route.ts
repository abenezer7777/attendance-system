import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setHours(0, 0, 0, 0);

    const [earlyLeave, absents, lateIn, totalLeaves] = await Promise.all([
      prisma.attendance.count({
        where: {
          userId,
          status: "PRESENT",
          checkIn: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),
      prisma.attendance.count({
        where: {
          userId,
          status: "ABSENT",
          checkIn: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),
      prisma.attendance.count({
        where: {
          userId,
          status: "LATE",
          checkIn: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),
      prisma.attendance.count({
        where: {
          userId,
          checkIn: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),
    ]);

    return NextResponse.json({
      earlyLeave,
      absents,
      lateIn,
      totalLeaves,
    });
  } catch (error) {
    console.error("Monthly attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
