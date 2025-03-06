import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
          deletedAt: null,
        },
        select: {
          id: true,
          fullName: true,
        },
        skip: offset,
        take: limit,
        orderBy: {
          fullName: "asc",
        },
      }),
      prisma.user.count({
        where: {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
          deletedAt: null,
        },
      }),
    ]);

    return NextResponse.json({
      users,
      total,
      hasMore: offset + users.length < total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
