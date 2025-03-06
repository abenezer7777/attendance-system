// import { authOptions } from "@/lib/authOptions";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // Check if the session is null
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const currentUser = await prisma.employee.findUnique({
      where: {
        email: session.user.email, // Guaranteed to be defined at this point
      },
      include: {
        roles: {
          include: {
            abilities: true,
          },
        },
      },
    });

    // If no user is found, return an appropriate error
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
