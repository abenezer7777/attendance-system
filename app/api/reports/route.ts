import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Schema for query parameters
const querySchema = z.object({
  role: z
    .enum([
      "EMPLOYEE",
      "SUPERVISOR",
      "MANAGER",
      "OFFICER",
      "EXECUTIVE",
      "CHIEF_EXECUTIVE",
      "ADMIN",
    ])
    .optional(),
  buildingId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().transform(Number).optional().default("1"),
  limit: z.string().transform(Number).optional().default("10"),
  status: z
    .enum([
      "CHECKED_IN",
      "EARLY_LEAVE",
      "PRESENT",
      "LATE",
      "ABSENT",
      "AUTO_CHECKOUT",
    ])
    .optional(),
});

export async function GET(request: Request) {
  try {
    // Get the session and verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));

    // Get the current user's details including their role
    const currentUser = await prisma.employee.findUnique({
      where: { email: session.user.email! },
      include: {
        roles: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Base query object
    const baseQuery: any = {
      where: {},
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            division: true,
            department: true,
            section: true,
            locationCategory: true,
            location: true,
          },
        },
        building: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    };

    // Apply date filters if provided
    if (query.startDate) {
      baseQuery.where.checkIn = {
        ...baseQuery.where.checkIn,
        gte: new Date(query.startDate),
      };
    }

    if (query.endDate) {
      baseQuery.where.checkIn = {
        ...baseQuery.where.checkIn,
        lte: new Date(query.endDate),
      };
    }

    // Apply status filter if provided
    if (query.status) {
      baseQuery.where.status = query.status;
    }

    // Apply building filter if provided
    if (query.buildingId) {
      baseQuery.where.buildingId = query.buildingId;
    }

    // Apply role-based filters
    const userRole = currentUser.roles[0]?.name || "EMPLOYEE";
    switch (userRole) {
      case "ADMIN":
        // Admin can see all records
        break;

      case "CHIEF_EXECUTIVE":
        // CHIEF_EXECUTIVE can see all company records,
        // so do not apply any additional filtering on the employee.
        break;

      case "EXECUTIVE":
        baseQuery.where.employee = {
          division: currentUser.division,
        };
        break;
      case "OFFICER":
        // Can see records within their department
        baseQuery.where.employee = {
          department: currentUser.department,
        };
        break;

      case "MANAGER":
        // Can see records within their section
        baseQuery.where.employee = {
          section: currentUser.section,
        };
        break;

      case "SUPERVISOR":
        // Can see records of employees they supervise
        baseQuery.where.employee = {
          immediateSupervisor: currentUser.id,
        };
        break;

      case "EMPLOYEE":
        // Can only see their own records
        baseQuery.where.employeeId = currentUser.id;
        break;

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    // Calculate pagination
    const skip = (query.page - 1) * query.limit;
    baseQuery.skip = skip;
    baseQuery.take = query.limit;

    // Execute queries
    const [total, records] = await Promise.all([
      prisma.attendance.count({ where: baseQuery.where }),
      prisma.attendance.findMany(baseQuery),
    ]);

    // Transform the data for the response
    const data = records.map((record) => ({
      id: record.id,
      employeeId: record.employee?.id,
      fullName: record.employee?.fullName,
      checkIn: record.checkIn.toISOString(),
      checkOut: record.checkOut?.toISOString(),
      location: record.employee?.location,
      locationCategory: record.employee?.locationCategory,
      building: record.building.name,
      division: record.employee?.division,
      department: record.employee?.department,
      section: record.employee?.section,
      status: record.status,
    }));

    return NextResponse.json({
      data,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
