// import { NextResponse } from "next/server";
// import { hash } from "bcryptjs";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     // Check if the request contains multiple users (from CSV)
//     const usersData = body.users ? body.users : [body];
//     const results = [];

//     // Iterate over each user data object
//     for (const userData of usersData) {
//       const {
//         employeeId,
//         email,
//         fullName,
//         password,
//         roleName,
//         division,
//         department,
//         section,
//         locationCategory,
//         location,
//         jobTitle,
//         jobRole,
//       } = userData;

//       // Validate that required fields exist
//       if (!email || !employeeId || !fullName || password === undefined) {
//         results.push({
//           error: `Missing required fields for employeeId: ${
//             employeeId || "unknown"
//           }`,
//         });
//         continue;
//       }

//       // Check if email already exists
//       const existingUserByEmail = await prisma.user.findUnique({
//         where: { email },
//       });
//       if (existingUserByEmail) {
//         results.push({
//           error: `User with email ${email} already exists`,
//         });
//         continue;
//       }

//       // Check if employeeId already exists
//       const existingUserByEmployeeId = await prisma.user.findUnique({
//         where: { employeeId },
//       });
//       if (existingUserByEmployeeId) {
//         results.push({
//           error: `User with employeeId ${employeeId} already exists`,
//         });
//         continue;
//       }

//       // Check if the role exists (using roleName from CSV)
//       const existingRole = await prisma.role.findUnique({
//         where: { name: roleName },
//       });
//       if (!existingRole) {
//         results.push({
//           error: `Role '${roleName}' does not exist for employeeId ${employeeId}`,
//         });
//         continue;
//       }

//       // Hash the password (if provided; you may want to enforce non-empty passwords)
//       const hashedPassword = await hash(password, 10);

//       try {
//         const newUser = await prisma.user.create({
//           data: {
//             employeeId,
//             email,
//             fullName,
//             division,
//             department,
//             section,
//             location,
//             locationCategory,
//             jobRole,
//             jobTitle,
//             password: hashedPassword,
//             roleId: existingRole.id,
//           },
//         });
//         results.push({ success: true, user: newUser });
//       } catch (e: any) {
//         results.push({
//           error: `Failed to create user with employeeId ${employeeId}: ${e.message}`,
//         });
//       }
//     }

//     return NextResponse.json(results);
//   } catch (error: any) {
//     console.error("Signup error:", error.message);
//     return NextResponse.json({ error: "Signup failed" }, { status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   try {
//     // Fetch all users with their roles and abilities
//     const users = await prisma.user.findMany({
//       include: {
//         role: {
//           include: {
//             abilities: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(users);
//   } catch (error: any) {
//     console.error("Fetch users error:", error.message);
//     return NextResponse.json(
//       { error: "Failed to fetch users" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createUserSchema } from "@/lib/schemas/validationSchema";

// Define a validation schema for creating a user
// const createUserSchema = z.object({
//   employeeId: z.string().min(1, "Employee ID is required"),
//   email: z.string().email("Invalid email"),
//   fullName: z.string().min(1, "Full name is required"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   roleName: z.string().min(1, "Role is required"),
//   organizationId: z.string().min(1, "Organization is required"),
//   assignedLocationIds: z.array(z.string()).optional(),
//   jobTitle: z.string(),
//   jobRole: z.string(),
//   mobile: z.string().optional(),
// });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received payload:", body);

    // Validate request payload
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    const userData = parsed.data;

    const {
      id,
      email,
      fullName,
      password,
      roleName,
      organizationId,
      assignedLocationIds,
      jobTitle,
      jobRole,
      mobile,
    } = userData;

    // Check for duplicate email
    const existingUserByEmail = await prisma.employee.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: `User with email ${email} already exists` },
        { status: 400 }
      );
    }

    // Check for duplicate employeeId
    const existingUserByEmployeeId = await prisma.employee.findUnique({
      where: { id },
    });
    if (existingUserByEmployeeId) {
      return NextResponse.json(
        { error: `User with employeeId ${id} already exists` },
        { status: 400 }
      );
    }

    // Validate that the role exists
    const existingRole = await prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!existingRole) {
      return NextResponse.json(
        { error: `Role '${roleName}' does not exist` },
        { status: 400 }
      );
    }

    // Validate that the organization exists
    // const existingOrg = await prisma.organization.findUnique({
    //   where: { id: organizationId },
    // });
    // if (!existingOrg) {
    //   return NextResponse.json(
    //     { error: `Organization with ID '${organizationId}' not found` },
    //     { status: 400 }
    //   );
    // }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.employee.create({
      data: {
        id,
        email,
        fullName,
        // password: hashedPassword,
        // roleId: existingRole.id,
        // organizationId,
        jobTitle,
        jobRole,
        // mobile,
        // assignedLocations: {
        //   connect: assignedLocationIds?.map((id: string) => ({ id })) || [],
        // },
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const users = await prisma.employee.findMany({
      include: {
        roles: { include: { abilities: true } },
        // organization: true,
        buildings: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Fetch users error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
