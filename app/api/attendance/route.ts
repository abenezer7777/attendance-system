import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  handleAttendance,
  getAttendanceRecords,
  hasOpenCheckIn,
} from "@/lib/api/attendance";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { locationId, latitude, longitude, type } = await req.json();

    // Check for open check-ins at the same location if user is trying to check in
    if (type === "check-in") {
      const hasOpen = await hasOpenCheckIn(
        session.user.id as string,
        locationId
      );
      if (hasOpen) {
        return NextResponse.json(
          {
            error:
              "You already have an open check-in at this location. Please check out first.",
          },
          { status: 400 }
        );
      }
    }

    const attendance = await handleAttendance({
      userId: session.user.id as string,
      locationId,
      latitude,
      longitude,
      type,
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Attendance error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: any = {
      userId: session.user.id as string,
      checkIn: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    };

    // Add status filters
    if (filter !== "all") {
      switch (filter) {
        case "early":
          whereClause.status = "EARLYLEAVE";
          break;
        case "late":
          whereClause.status = "LATE";
          break;
        case "absent":
          whereClause.status = "ABSENT";
          break;
        case "present":
          whereClause.status = "PRESENT";
          break;
        case "autocheckout":
          whereClause.status = "AUTOCHECKOUT";
          break;
      }
    }

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where: whereClause,
        include: { location: true },
        orderBy: { checkIn: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.attendance.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      data: records,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    // Delete all attendance records for the user
    await prisma.attendance.deleteMany({
      where: { userId: userId, user: {} },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete attendance records" },
      { status: 500 }
    );
  }
}
