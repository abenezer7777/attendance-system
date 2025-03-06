import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const oneHourAgo = new Date(Date.now() - 5 * 60 * 1000); // 1 hour ago

    // Find all open check-ins older than 1 hour
    const openCheckIns = await prisma.attendance.findMany({
      where: {
        checkOut: null,
        checkIn: {
          lt: oneHourAgo,
        },
      },
    });

    // Auto checkout all found records
    const updates = openCheckIns.map((record) =>
      prisma.attendance.update({
        where: { id: record.id },
        data: {
          checkOut: new Date(),
          status: "AUTO_CHECKOUT",
        },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({
      message: `Auto checked-out ${updates.length} records`,
    });
  } catch (error) {
    console.error("Auto-checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process auto-checkouts" },
      { status: 500 }
    );
  }
}
