import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Schema for query parameters
const querySchema = z.object({
  role: z
    .enum([
      "employee",
      "supervisor",
      "manager",
      "officer",
      "chief_executive",
      "admin",
    ])
    .optional(),
  organizationId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().transform(Number).optional().default("1"),
  limit: z.string().transform(Number).optional().default("10"),
  status: z
    .enum(["EARLYLEAVE", "PRESENT", "LATE", "ABSENT", "AUTOCHECKOUT"])
    .optional(),
  locationId: z.string().optional(),
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
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        role: true,
        organization: true,
      },
    });
    console.log("currentUser", currentUser);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Base query object
    const baseQuery: any = {
      where: {},
      include: {
        user: {
          select: {
            employeeId: true,
            fullName: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
        location: {
          select: {
            name: true,
            category: true,
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

    // Apply location filter if provided
    if (query.locationId) {
      baseQuery.where.locationId = query.locationId;
    }

    // Apply role-based filters
    switch (currentUser.role.name) {
      case "admin":
        // Admin can see all records
        if (query.organizationId) {
          baseQuery.where.user = {
            organizationId: query.organizationId,
          };
        }
        break;

      case "chief_executive":
        // Can see all records within their organization and child organizations
        const childOrgs = await prisma.organization.findMany({
          where: {
            OR: [
              { id: currentUser.organizationId },
              { parentId: currentUser.organizationId },
            ],
          },
          select: { id: true },
        });
        baseQuery.where.user = {
          organizationId: {
            in: childOrgs.map((org) => org.id),
          },
        };
        break;

      case "manager":
        // Can see records within their organization
        baseQuery.where.user = {
          organizationId: currentUser.organizationId,
        };
        break;

      case "supervisor":
        // Can see records of users they supervise
        const supervisedOrg = await prisma.organization.findFirst({
          where: {
            supervisorId: currentUser.id,
          },
          select: { id: true },
        });
        if (!supervisedOrg) {
          return NextResponse.json(
            { error: "No supervised organization found" },
            { status: 403 }
          );
        }
        baseQuery.where.user = {
          organizationId: supervisedOrg.id,
        };
        break;

      case "employee":
        // Can only see their own records
        baseQuery.where.userId = currentUser.id;
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
      employeeId: record.user.employeeId,
      fullName: record.user.fullName,
      checkIn: record.checkIn.toISOString(),
      checkOut: record.checkOut?.toISOString(),
      location: record.location.name,
      locationCategory: record.location.category,
      organization: record.user.organization.name,
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
