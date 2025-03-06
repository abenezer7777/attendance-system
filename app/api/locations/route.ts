// // import { NextResponse } from "next/server";
// // import { getServerSession } from "next-auth/next";
// // import { prisma } from "@/lib/prisma";
// // import { authOptions } from "@/lib/auth";

// // export async function GET(req: Request) {
// //   try {
// //     const session = await getServerSession(authOptions);

// //     if (!session?.user) {
// //       return NextResponse.json(
// //         { error: "Unauthorized" },
// //         { status: 401 }
// //       );
// //     }

// //     const locations = await prisma.location.findMany({
// //       where: {
// //         users: {
// //           some: {
// //             id: session.user.id as string,
// //           },
// //         },
// //       },
// //     });

// //     return NextResponse.json(locations);
// //   } catch (error) {
// //     console.error("Fetch locations error:", error);
// //     return NextResponse.json(
// //       { error: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/lib/auth";
// import { z } from "zod";

// const locationSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   latitude: z.number(),
//   longitude: z.number(),
//   radius: z.number().positive("Radius must be positive"),
// });

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const locations = await prisma.location.findMany({
//       where: {
//         users: {
//           some: {
//             id: session.user.id as string,
//           },
//         },
//       },
//     });

//     return NextResponse.json(locations);
//   } catch (error) {
//     console.error("Fetch locations error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const validation = locationSchema.safeParse(body);

//     if (!validation.success) {
//       return NextResponse.json(
//         { error: validation.error.errors },
//         { status: 400 }
//       );
//     }

//     const location = await prisma.location.create({
//       data: {
//         ...validation.data,
//         // users: {
//         //   connect: { id: session.user.id as string },
//         // },
//       },
//     });

//     return NextResponse.json(location);
//   } catch (error) {
//     console.error("Create location error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { locationSchema } from "@/lib/schemas/validationSchema";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locations = await prisma.building.findMany({
      where: {
        employees: {
          some: {
            id: session.user.id as string,
          },
        },
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Fetch locations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = locationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const location = await prisma.building.create({
      data: {
        ...validation.data,
        // Connect the current user so that the GET query returns this location
        // users: {
        //   connect: { id: session.user.id as string },
        // },
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("Create location error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
