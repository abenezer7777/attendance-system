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

    // Get locationId from query params
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");

    if (!locationId) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    // Get today's records for this specific location
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = await prisma.attendance.findMany({
      where: {
        userId: session.user.id as string,
        locationId: locationId,
        checkIn: {
          gte: today,
        },
      },
      include: {
        location: true,
      },
      orderBy: {
        checkIn: "asc",
      },
    });

    const activeAttendance = todayRecords.find((record) => !record.checkOut);
    const firstRecord = todayRecords[0]?.checkIn;

    // Get the most recent action for this location
    const lastAction = todayRecords.reduce((latest, record) => {
      const checkOut = record.checkOut ? new Date(record.checkOut) : null;
      const checkIn = new Date(record.checkIn);

      if (!latest) return checkOut || checkIn;

      if (checkOut && checkOut > latest) return checkOut;
      if (checkIn > latest) return checkIn;

      return latest;
    }, null as Date | null);

    return NextResponse.json({
      hasActiveCheckIn: !!activeAttendance,
      activeLocation: activeAttendance?.location || null,
      firstRecord: firstRecord ? firstRecord.toISOString() : null,
      lastRecord: lastAction ? lastAction.toISOString() : null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
