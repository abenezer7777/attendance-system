/*
  Warnings:

  - You are about to drop the column `latitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `radius` on the `Location` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Attendance_userId_locationId_checkIn_idx";

-- DropIndex
DROP INDEX "Location_name_category_idx";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "geolocationId" TEXT;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "radius",
ADD COLUMN     "geolocationId" TEXT;

-- CreateTable
CREATE TABLE "Geolocation" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Geolocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Geolocation_latitude_longitude_name_idx" ON "Geolocation"("latitude", "longitude", "name");

-- CreateIndex
CREATE INDEX "Attendance_userId_locationId_checkIn_geolocationId_idx" ON "Attendance"("userId", "locationId", "checkIn", "geolocationId");

-- CreateIndex
CREATE INDEX "Location_name_category_geolocationId_idx" ON "Location"("name", "category", "geolocationId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_geolocationId_fkey" FOREIGN KEY ("geolocationId") REFERENCES "Geolocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_geolocationId_fkey" FOREIGN KEY ("geolocationId") REFERENCES "Geolocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
