import { prisma } from "@/lib/prisma";
import { isWithinRadius } from "@/lib/utils/geo";

interface AttendanceParams {
  employeeId: string;
  buildingId: string;
  latitude: number;
  longitude: number;
  type: "check-in" | "check-out";
}

export async function handleAttendance({
  employeeId,
  buildingId,
  latitude,
  longitude,
  type,
}: AttendanceParams) {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
  });

  if (!building) {
    throw new Error("Location not found");
  }

  const withinRadius = isWithinRadius(
    latitude,
    longitude,
    building.latitude,
    building.longitude,
    building.radius
  );

  if (!withinRadius) {
    throw new Error("You are not within the allowed radius of this location");
  }

  if (type === "check-in") {
    return prisma.attendance.create({
      data: {
        employeeId,
        buildingId,
        checkIn: new Date(),
        status: "CHECKED_IN",
      },
    });
  }

  const attendance = await prisma.attendance.findFirst({
    where: {
      employeeId,
      buildingId,
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
  employeeId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where: { employeeId },
      include: { building: true },
      orderBy: { checkIn: "desc" },
      skip,
      take: limit,
    }),
    prisma.attendance.count({
      where: { employeeId },
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
  employeeId: string,
  buildingId: string
): Promise<boolean> {
  const openCheckIn = await prisma.attendance.findFirst({
    where: {
      employeeId: employeeId,
      buildingId: buildingId,
      checkOut: null,
    },
  });

  return !!openCheckIn;
}
