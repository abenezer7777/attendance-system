import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getUserSessionAndAbility } from "@/lib/authUtils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // const session = await getServerSession(authOptions);
  // console.log("🚀 ~ POST ~ session:", session);

  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  try {
    // const { ability } = await getUserSessionAndAbility();

    // Authorization check
    // if (!ability.can("create", "User")) {
    //   return NextResponse.json(
    //     {
    //       error: "Forbidden: You do not have permission to create User",
    //     },
    //     { status: 403 }
    //   );
    // }
    const body = await req.json();
    const {
      employeeId,
      email,
      fullName,
      password,
      roleName,
      division,
      department,
      section,
      locationCategory,
      location,
      jobTitle,
      jobRole,
    } = body;
    //check if email already exists
    const existingUserByEamil = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEamil) {
      return NextResponse.json(
        {
          user: null,
          message: "user with this email already esists",
        },
        { status: 409 }
      );
    }
    // Check if the role exists
    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!existingRole) {
      return NextResponse.json(
        {
          user: null,
          message: `Role '${roleName}' does not exist`,
        },
        { status: 400 }
      );
    }
    // Hash the password
    const hashedPassword = await hash(password, 10);
    const userName = email.split("@");

    // Save the new user
    const newUser = await prisma.user.create({
      data: {
        employeeId,
        email,
        fullName,
        division,
        department,
        section,
        location,
        locationCategory,
        jobRole,
        jobTitle,
        // username: userName[0],
        password: hashedPassword,
        roleId: existingRole.id,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // const session = await getServerSession(authOptions);
  // console.log("🚀 ~ POST ~ session:", session);

  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  try {
    // const { ability } = await getUserSessionAndAbility();
    // if (!ability.can("create", "User")) {
    //   return NextResponse.json(
    //     {
    //       error: "Forbidden: You do not have permission to create User",
    //     },
    //     { status: 403 }
    //   );
    // }
    // Fetch all users with their roles and abilities
    const users = await prisma.user.findMany({
      include: {
        role: {
          include: {
            abilities: true,
          },
        },
      },
      orderBy: { createdAt: "desc" }, // Optional: Sort users by creation date
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
