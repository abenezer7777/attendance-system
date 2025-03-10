import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const createTeamSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["division", "department"]),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.employee.findUnique({
      where: { id: session.user.id! },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get divisions and departments based on user's role
    const role = user.roles[0]?.name || "EMPLOYEE";
    let divisions: string[] = [];
    let departments: string[] = [];

    switch (role) {
      case "ADMIN":
        // Admin can see all divisions and departments
        divisions = await prisma.employee
          .findMany({
            distinct: ["division"],
            select: { division: true },
            where: { division: { not: null } },
          })
          .then((items) => items.map((i) => i.division!));

        departments = await prisma.employee
          .findMany({
            distinct: ["department"],
            select: { department: true },
            where: { department: { not: null } },
          })
          .then((items) => items.map((i) => i.department!));
        break;

      case "CHIEF_EXECUTIVE":
        // Can see their division and all departments within it
        divisions = [user.division!];
        departments = await prisma.employee
          .findMany({
            distinct: ["department"],
            select: { department: true },
            where: {
              division: user.division,
              department: { not: null },
            },
          })
          .then((items) => items.map((i) => i.department!));
        break;

      case "EXECUTIVE":
        divisions = [user.division!];
        departments = await prisma.employee
          .findMany({
            distinct: ["department"],
            select: { department: true },
            where: {
              division: user.division,
              department: { not: null },
            },
          })
          .then((items) => items.map((i) => i.department!));
        break;
      case "OFFICER":
        // Can see their department
        departments = [user.department!];
        break;

      case "MANAGER":
        // Can see their section
        departments = [user.section!];
        break;

      case "SUPERVISOR":
        // Can see teams they supervise
        departments = await prisma.employee
          .findMany({
            distinct: ["department"],
            select: { department: true },
            where: {
              immediateSupervisor: user.fullName,
              department: { not: null },
            },
          })
          .then((items) => items.map((i) => i.department!));
        break;

      default:
        // Employee can only see their own department
        if (user.department) {
          departments = [user.department];
        }
    }

    return NextResponse.json({
      groups: [
        {
          label: "Divisions",
          teams: divisions.map((d) => ({
            label: d,
            value: d.toLowerCase(),
            type: "division",
          })),
        },
        {
          label: "Departments",
          teams: departments.map((d) => ({
            label: d,
            value: d.toLowerCase(),
            type: "department",
          })),
        },
      ],
    });
  } catch (error) {
    console.error("Teams API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.employee.findUnique({
      where: { email: session.user.email! },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only ADMIN and CHIEF_EXECUTIVE can create new teams
    const role = user.roles[0]?.name;
    if (role !== "ADMIN" && role !== "CHIEF_EXECUTIVE") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, type } = createTeamSchema.parse(body);

    // Update or create the team in the appropriate field
    if (type === "division") {
      await prisma.employee.update({
        where: { id: user.id },
        data: { division: name },
      });
    } else {
      await prisma.employee.update({
        where: { id: user.id },
        data: { department: name },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Create team API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
