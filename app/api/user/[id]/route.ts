import { NextResponse } from "next/server";
// import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
import { hash } from "bcryptjs";
import { getUserSessionAndAbility } from "@/lib/authUtils";
import { createUserSchema } from "@/lib/schemas/validationSchema";
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

  if (!ability.can("update", "User")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to update users" },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    const body = await req.json();

    // Validate the request body with the schema without password
    const validatedData = createUserSchema.omit({ password: true }).parse(body);

    const {
      email,
      fullName,
      roleName,
      employeeId,
      organizationId,
      jobTitle,
      jobRole,
      mobile,
      supervisorId,
      assignedLocationIds = [],
    } = validatedData;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!existingRole) {
      return NextResponse.json(
        { error: `Role '${roleName}' does not exist` },
        { status: 400 }
      );
    }

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!existingOrg) {
      return NextResponse.json(
        { error: `Organization does not exist` },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      email,
      fullName,
      roleId: existingRole.id,
      employeeId,
      organizationId,
      jobTitle,
      jobRole,
      mobile,
      supervisorId: supervisorId || null,
      assignedLocations: {
        set: assignedLocationIds.map((locationId: string) => ({
          id: locationId,
        })),
      },
    };

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
        organization: true,
        assignedLocations: true,
        supervisor: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
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

  if (!ability.can("delete", "User")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to delete users" },
      { status: 403 }
    );
  }

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
