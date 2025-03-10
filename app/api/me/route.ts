import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Retrieve session. (If needed, you could pass `request` as well.)
  const session = await getServerSession(authOptions);

  // Validate session and required user properties.
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Find the current user using the email from session.
    const currentUser = await prisma.employee.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        roles: {
          include: {
            abilities: true,
          },
        },
      },
    });

    // Handle case where no user is found.
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(currentUser);
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
