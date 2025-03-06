import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { createOrganizationSchema } from "@/lib/schemas/validationSchema";
import { getUserSessionAndAbility } from "@/lib/authUtils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type Organ = z.infer<typeof createOrganizationSchema>;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ POST ~ session:", session);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { ability } = await getUserSessionAndAbility();

    // Authorization check
    if (!ability.can("create", "Organizations")) {
      return NextResponse.json(
        {
          error: "Forbidden: You do not have permission to create organization",
        },
        { status: 403 }
      );
    }
    const body = await req.json();
    // console.log("🚀 ~ POST ~ body:", body);
    const {
      level,
      name,
      parentId = null,
    } = createOrganizationSchema.parse(body);
    // // check if orga arleady exist
    // const existingOrganById = await prisma.organization.findUnique({
    //   where: { id: id },
    // });
    // if (existingOrganById) {
    //   return NextResponse.json(
    //     { user: null, message: "Organization  already exists" },
    //     { status: 409 }
    //   );
    // }

    const newOrg = await prisma.organization.create({
      data: {
        level,
        name,

        parentId,
      },
    });
    // const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      { newOrg, message: "Organization create successfuly" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

// Fetch organizations with only id and name fields
export async function GET() {
  try {
    const { ability } = await getUserSessionAndAbility();

    // Authorization check
    if (!ability.can("read", "Organization")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to view organization" },
        { status: 403 }
      );
    }
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        children: true,
      },
      orderBy: {
        name: "asc", // Optional: Order organizations alphabetically
      },
    });
    return NextResponse.json(organizations, { status: 200 });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
