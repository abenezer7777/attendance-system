import { NextResponse } from "next/server";
// import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
import { hash } from "bcryptjs";
import { getUserSessionAndAbility } from "@/lib/authUtils";
import { editUserSchema } from "@/schemas/validationSchema";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH: Edit user
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ability } = await getUserSessionAndAbility();

  // if (!ability.can("update", "User")) {
  //   return NextResponse.json(
  //     { error: "Forbidden: You do not have permission to update users" },
  //     { status: 403 }
  //   );
  // }

  try {
    const { id } = params;
    const body = await req.json();
    // const data = editUserSchema.parse(body);
    const {
      email,
      fullName,
      password,
      roleName,
      employeeId,
      location,
      locationCategory,
      jobRole,
      jobTitle,
    } = body;

    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!existingRole) {
      return NextResponse.json(
        { error: `Role '${roleName}' does not exist` },
        { status: 400 }
      );
    }
    const userName = email.split("@");
    const updatedData: any = {
      email,
      fullName,
      roleId: existingRole.id,
      employeeId,
      location,
      locationCategory,
      jobRole,
      jobTitle,
      // username: userName[0],
    };
    if (password) {
      updatedData.password = await hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Delete user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ability } = await getUserSessionAndAbility();

  // if (!ability.can("delete", "User")) {
  //   return NextResponse.json(
  //     { error: "Forbidden: You do not have permission to delete users" },
  //     { status: 403 }
  //   );
  // }

  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
