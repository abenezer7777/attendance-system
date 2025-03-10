import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/schemas/validationSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createUserSchema.parse(body);

    const {
      id,
      email,
      fullName,
      // password,
      roleName,
      immediateSupervisor,
      // supervisorId,
      phone,
      // assignedLocationIds = [],
      division,
      department,
      section,
      jobTitle,
      jobRole,
    } = validatedData;

    // Check for existing user by email
    const existingUserByEmail = await prisma.employee.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: `User with email ${email} already exists` },
        { status: 400 }
      );
    }

    // Check for existing user by employee ID
    const existingUserByEmployeeId = await prisma.employee.findUnique({
      where: { id: id },
    });
    if (existingUserByEmployeeId) {
      return NextResponse.json(
        { error: `User with employee ID ${id} already exists` },
        { status: 400 }
      );
    }

    // Verify role exists
    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!existingRole) {
      return NextResponse.json(
        { error: `Role '${roleName}' does not exist` },
        { status: 400 }
      );
    }

    // Hash password
    // const hashedPassword = await hash(password, 10);

    // Create user with all relationships
    const newUser = await prisma.employee.create({
      data: {
        id,
        email,
        fullName,
        phone,
        division,
        department,
        section,
        jobTitle,
        jobRole,
        immediateSupervisor,
        locationCategory: "HEAD_QUARTER",
        location: "Head Office",
        category: "REGULAR",
        roles: {
          connect: { id: existingRole.id },
        },
        // buildings: {
        //   connect: assignedLocationIds.map((id) => ({ id })),
        // },
      },
      include: {
        roles: true,
        buildings: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const users = await prisma.employee.findMany({
      include: {
        roles: {
          include: {
            abilities: true,
          },
        },
        buildings: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Fetch users error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
