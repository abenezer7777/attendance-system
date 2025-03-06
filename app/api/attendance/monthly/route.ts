// app/api/attendance/monthly/route.ts
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

    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");

    // Determine if the logged-in user is an admin.
    const isAdmin =
      session.user.role &&
      (typeof session.user.role === "string"
        ? session.user.role === "ADMIN"
        : session.user.role.name === "ADMIN");

    // Calculate the start and end of the current month.
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setHours(0, 0, 0, 0);

    // Build the base filter for the current month.
    let baseFilter: any = {
      checkIn: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    };

    if (!isAdmin) {
      // For non-admin users, always filter by their own ID.
      baseFilter.userId = session.user.id;
    } else {
      // For admins, if a userId is provided in the query, use it.
      if (queryUserId) {
        baseFilter.userId = queryUserId;
      }
      // Otherwise, leave it out to get aggregated data for all employees.
    }

    // Run queries concurrently.
    const [present, earlyLeave, absents, lateIn, total] = await Promise.all([
      prisma.attendance.count({
        where: {
          ...baseFilter,
          status: "PRESENT",
        },
      }),
      prisma.attendance.count({
        where: {
          ...baseFilter,
          status: "EARLY_LEAVE",
        },
      }),
      prisma.attendance.count({
        where: {
          ...baseFilter,
          status: "ABSENT",
        },
      }),
      prisma.attendance.count({
        where: {
          ...baseFilter,
          status: "LATE",
        },
      }),
      prisma.attendance.count({
        where: baseFilter,
      }),
    ]);

    return NextResponse.json({
      present,
      earlyLeave,
      absents,
      lateIn,
      total,
    });
  } catch (error) {
    console.error("Monthly attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
