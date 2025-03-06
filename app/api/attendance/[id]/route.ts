import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");

  if (!employeeId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    // Delete all attendance records for the user
    await prisma.attendance.deleteMany({
      where: { employeeId: employeeId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete attendance records" },
      { status: 500 }
    );
  }
}
