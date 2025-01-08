import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  handleAttendance,
  getAttendanceRecords,
  hasOpenCheckIn,
} from "@/lib/api/attendance";

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

    const result = await getAttendanceRecords(
      session.user.id as string,
      page,
      limit
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
