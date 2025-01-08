import { prisma } from "@/lib/prisma";
import { isWithinRadius } from "@/lib/utils/geo";

interface AttendanceParams {
  userId: string;
  locationId: string;
  latitude: number;
  longitude: number;
  type: "check-in" | "check-out";
}

export async function handleAttendance({
  userId,
  locationId,
  latitude,
  longitude,
  type,
}: AttendanceParams) {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    throw new Error("Location not found");
  }

  const withinRadius = isWithinRadius(
    latitude,
    longitude,
    location.latitude,
    location.longitude,
    location.radius
  );

  if (!withinRadius) {
    throw new Error("You are not within the allowed radius of this location");
  }

  if (type === "check-in") {
    return prisma.attendance.create({
      data: {
        userId,
        locationId,
        checkIn: new Date(),
        status: "PRESENT",
      },
    });
  }

  const attendance = await prisma.attendance.findFirst({
    where: {
      userId,
      locationId,
      checkOut: null,
    },
    orderBy: {
      checkIn: "desc",
    },
  });

  if (!attendance) {
    throw new Error("No active check-in found");
  }

  return prisma.attendance.update({
    where: { id: attendance.id },
    data: { checkOut: new Date() },
  });
}

export async function getAttendanceRecords(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where: { userId },
      include: { location: true },
      orderBy: { checkIn: "desc" },
      skip,
      take: limit,
    }),
    prisma.attendance.count({
      where: { userId },
    }),
  ]);

  return {
    data: records,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      current: page,
    },
  };
}

export async function hasOpenCheckIn(
  userId: string,
  locationId: string
): Promise<boolean> {
  const openCheckIn = await prisma.attendance.findFirst({
    where: {
      userId: userId,
      locationId: locationId,
      checkOut: null,
    },
  });

  return !!openCheckIn;
}
