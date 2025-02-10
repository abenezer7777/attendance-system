import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("session from backend export", session);

    // Check if the session user exists and the role name is "ADMIN"
    if (!session?.user || session.user.role.name !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    // const department = url.searchParams.get("department");
    const division = url.searchParams.get("division");
    const userId = url.searchParams.get("userId");

    const where: any = {
      checkIn: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (division) {
      where.user = {
        division: division,
      };
    }

    if (userId) {
      where.userId = userId;
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
            employeeId: true,
            division: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    });

    return NextResponse.json({ data: records });
  } catch (error) {
    console.error("Export attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
