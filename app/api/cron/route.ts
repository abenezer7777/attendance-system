import { NextRequest, NextResponse } from "next/server";
import { autoCheckoutJob } from "@/lib/cron";

export async function GET(req: NextRequest) {
  // Security check
  // const authHeader = req.headers.get("authorization");
  // console.log("authheader ", authHeader);
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const result = await autoCheckoutJob();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST() {
//   try {
//     const oneHourAgo = new Date(Date.now() - 1 * 60 * 1000); // 1 hour ago

//     // Find all open check-ins older than 1 hour
//     const openCheckIns = await prisma.attendance.findMany({
//       where: {
//         checkOut: null,
//         checkIn: {
//           lt: oneHourAgo,
//         },
//       },
//     });

//     // Auto checkout all found records
//     const updates = openCheckIns.map((record) =>
//       prisma.attendance.update({
//         where: { id: record.id },
//         data: {
//           checkOut: new Date(),
//           status: "AUTOCHECKOUT",
//         },
//       })
//     );

//     await prisma.$transaction(updates);

//     return NextResponse.json({
//       message: `Auto checked-out ${updates.length} records`,
//     });
//   } catch (error) {
//     console.error("Auto-checkout error:", error);
//     return NextResponse.json(
//       { error: "Failed to process auto-checkouts" },
//       { status: 500 }
//     );
//   }
// }
