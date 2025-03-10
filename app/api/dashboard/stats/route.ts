import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user's role and scope
    const currentUser = await prisma.employee.findUnique({
      where: { email: session.user.email! },
      include: { roles: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const role = currentUser.roles[0]?.name || "EMPLOYEE";

    // Base query filters based on role
    const baseFilter: any = {};
    switch (role) {
      case "ADMIN":
        // Admin can see all data
        break;
      case "CHIEF_EXECUTIVE":
        baseFilter.division;
        break;
      case "EXECUTIVE":
        baseFilter.division = currentUser.division;
        break;
      case "OFFICER":
        baseFilter.department = currentUser.department;
        break;
      case "MANAGER":
        baseFilter.section = currentUser.section;
        break;
      case "SUPERVISOR":
        baseFilter.immediateSupervisor = currentUser.fullName;
        break;
      case "EMPLOYEE":
        baseFilter.id = currentUser.id;
        break;
    }

    // Get total employees count
    const totalEmployees = await prisma.employee.count({
      where: baseFilter,
    });

    // Get present employees count for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const presentToday = await prisma.attendance.count({
      where: {
        employee: baseFilter,
        checkIn: {
          gte: today,
        },
        status: {
          in: ["CHECKED_IN", "PRESENT"],
        },
      },
    });

    // Get department and section counts
    const departmentCount = await prisma.employee
      .groupBy({
        by: ["department"],
        where: baseFilter,
        _count: true,
      })
      .then((groups) => groups.length);

    const sectionCount = await prisma.employee
      .groupBy({
        by: ["section"],
        where: baseFilter,
        _count: true,
      })
      .then((groups) => groups.length);

    // Get attendance overview (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const attendanceOverview = await prisma.attendance
      .groupBy({
        by: ["status"],
        where: {
          employee: baseFilter,
          checkIn: {
            gte: sevenDaysAgo,
          },
        },
        _count: true,
      })
      .then((groups) =>
        groups.map((g) => ({
          name: g.status,
          total: g._count,
        }))
      );

    // Get role distribution
    const roleDistribution = await prisma.role
      .findMany({
        include: {
          _count: {
            select: { employees: true },
          },
        },
      })
      .then((roles) =>
        roles.map((role) => ({
          name: role.name,
          value: role._count.employees,
        }))
      );

    // Get department stats
    const departmentStats = await prisma.employee
      .groupBy({
        by: ["department"],
        where: baseFilter,
        _count: true,
      })
      .then((groups) =>
        groups.map((g) => ({
          name: g.department || "Unassigned",
          value: g._count,
        }))
      );

    // Get recent attendance
    const recentAttendance = await prisma.attendance
      .findMany({
        where: {
          employee: baseFilter,
          checkIn: {
            gte: today,
          },
        },
        include: {
          employee: {
            select: {
              fullName: true,
            },
          },
        },
        orderBy: {
          checkIn: "desc",
        },
        take: 5,
      })
      .then((records) =>
        records.map((record) => ({
          id: record.id,
          employeeId: record.employeeId,
          fullName: record.employee?.fullName,
          checkIn: record.checkIn.toISOString(),
          checkOut: record.checkOut?.toISOString() || null,
          status: record.status,
        }))
      );

    return NextResponse.json({
      totalEmployees,
      presentToday,
      departmentCount,
      sectionCount,
      attendanceOverview,
      roleDistribution,
      departmentStats,
      recentAttendance,
    });
  } catch (error) {
    console.error("Dashboard stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
