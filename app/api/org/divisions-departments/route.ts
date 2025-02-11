import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch unique divisions
    const divisions = await prisma.user.findMany({
      select: { division: true },
      distinct: ["division"],
    });

    // Fetch unique departments
    const departments = await prisma.user.findMany({
      select: { department: true },
      distinct: ["department"],
    });

    // Format the data
    const formattedDivisions = divisions.map((d) => ({
      label: d.division || "N/A",
      value: d.division || "N/A",
    }));

    const formattedDepartments = departments.map((d) => ({
      label: d.department || "N/A",
      value: d.department || "N/A",
    }));

    return NextResponse.json({
      divisions: formattedDivisions,
      departments: formattedDepartments,
    });
  } catch (error) {
    console.error("Error fetching divisions and departments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
