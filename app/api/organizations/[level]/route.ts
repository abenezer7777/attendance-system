import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrgLevel } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fetch organizations with only id and name fields
export async function GET(
  
  { params }: { params: { level: string } }
) {
  // console.log("🚀 ~ GET ~ params:", params);
  // const level = params.params.level;
  const level = params.level;
  // console.log("🚀 ~ GET ~ level:", level);

  // Determine which level data to fetch based on the requested level
  let filterLevel: OrgLevel | undefined;

  if (level === "DEPARTMENT") {
    filterLevel = "DIVISION";
  } else if (level === "SECTION") {
    filterLevel = "DEPARTMENT";
  }
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ POST ~ session:", session);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const organizations = await prisma.organization.findMany({
      where: {
        level: filterLevel || undefined, // Only apply filter if filterLevel is set
      },
      select: {
        id: true,
        name: true,
        level: true,
      },
      orderBy: {
        name: "asc", // Optional: Order organizations alphabetically
      },
    });
    // console.log("🚀 ~ GET ~ organizations:", organizations);
    return NextResponse.json(organizations, { status: 200 });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
