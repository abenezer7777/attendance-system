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
        employeeId: session.user.id as string,
        // locationId: locationId,
        checkIn: {
          gte: today,
        },
      },
      include: {
        building: true,
      },
      orderBy: {
        checkIn: "asc",
      },
    });

    const activeAttendance = todayRecords.find((record) => !record.checkOut);
    const firstRecord = todayRecords[0]?.checkIn;

    // Get the last check-out time
    const lastCheckOut = todayRecords
      .filter((record) => record.checkOut)
      .reduce((latest, record) => {
        if (!latest || (record.checkOut && record.checkOut > latest)) {
          return record.checkOut;
        }
        return latest;
      }, null as Date | null);

    // Calculate total hours
    let totalHours = "00:00";
    if (firstRecord && lastCheckOut) {
      const diffInMs = lastCheckOut.getTime() - firstRecord.getTime();
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      totalHours = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }

    return NextResponse.json({
      hasActiveCheckIn: !!activeAttendance,
      activeLocation: activeAttendance?.building || null,
      firstRecord: firstRecord ? firstRecord.toISOString() : null,
      lastRecord: lastCheckOut ? lastCheckOut.toISOString() : null,
      totalHours,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
