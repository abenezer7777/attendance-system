/*
  Warnings:

  - You are about to drop the column `geolocationId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `geolocationId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the `Geolocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `latitude` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `radius` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_geolocationId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_geolocationId_fkey";

-- DropIndex
DROP INDEX "Attendance_userId_locationId_checkIn_geolocationId_idx";

-- DropIndex
DROP INDEX "Location_name_category_geolocationId_idx";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "geolocationId";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "geolocationId",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "radius" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Geolocation";

-- CreateIndex
CREATE INDEX "Attendance_userId_locationId_checkIn_idx" ON "Attendance"("userId", "locationId", "checkIn");

-- CreateIndex
CREATE INDEX "Location_name_category_idx" ON "Location"("name", "category");
