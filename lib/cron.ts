// lib/cron.ts (utility file)
import { prisma } from "@/lib/prisma";

interface CronJobResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function autoCheckoutJob(): Promise<CronJobResult> {
  try {
    const oneHourAgo = new Date(Date.now() - 2 * 60 * 1000);

    const openCheckIns = await prisma.attendance.findMany({
      where: {
        checkOut: null,
        checkIn: { lt: oneHourAgo },
      },
    });

    const updates = openCheckIns.map((record) =>
      prisma.attendance.update({
        where: { id: record.id },
        data: {
          checkOut: new Date(),
          status: "AUTOCHECKOUT",
        },
      })
    );

    await prisma.$transaction(updates);

    return {
      success: true,
      message: `Auto checked-out ${updates.length} records`,
    };
  } catch (error) {
    console.error("Auto-checkout error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process auto-checkouts",
    };
  }
}
