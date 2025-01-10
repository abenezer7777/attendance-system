import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isWithinRadius } from "@/lib/utils/geo";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { latitude, longitude } = await req.json();

    // Get all locations assigned to the user
    const userLocations = await prisma.location.findMany({
      where: {
        users: {
          some: {
            id: session.user.id as string,
          },
        },
      },
    });

    // Find the first location that the user is within radius of
    const validLocation = userLocations.find((location) =>
      isWithinRadius(
        latitude,
        longitude,
        location.latitude,
        location.longitude,
        location.radius
      )
    );

    return NextResponse.json({ location: validLocation || null });
  } catch (error) {
    console.error("Nearest location error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
