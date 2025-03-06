/*
  Warnings:

  - The values [AUTOCHECKOUT,EARLYLEAVE] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `locationId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LocationToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrgLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('CHECKED_IN', 'EARLY_LEAVE', 'PRESENT', 'LATE', 'ABSENT', 'AUTO_CHECKOUT');
ALTER TABLE "Attendance" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Attendance" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Attendance" ALTER COLUMN "status" SET DEFAULT 'CHECKED_IN';
COMMIT;

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "_LocationToUser" DROP CONSTRAINT "_LocationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LocationToUser" DROP CONSTRAINT "_LocationToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrgLocation" DROP CONSTRAINT "_OrgLocation_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrgLocation" DROP CONSTRAINT "_OrgLocation_B_fkey";

-- DropIndex
DROP INDEX "Attendance_userId_locationId_checkIn_idx";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "locationId",
DROP COLUMN "userId",
ADD COLUMN     "employeeId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'CHECKED_IN';

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_LocationToUser";

-- DropTable
DROP TABLE "_OrgLocation";

-- DropEnum
DROP TYPE "LocationCategory";

-- DropEnum
DROP TYPE "OrgLevel";

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "immediateSupervisor" TEXT,
    "phone" TEXT,
    "division" TEXT,
    "department" TEXT,
    "section" TEXT,
    "group" TEXT,
    "locationCategory" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmployeeToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BuildingToEmployee" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildingToEmployee_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_fullName_idx" ON "Employee"("fullName");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Building_name_idx" ON "Building"("name");

-- CreateIndex
CREATE INDEX "_EmployeeToRole_B_index" ON "_EmployeeToRole"("B");

-- CreateIndex
CREATE INDEX "_BuildingToEmployee_B_index" ON "_BuildingToEmployee"("B");

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToRole" ADD CONSTRAINT "_EmployeeToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToRole" ADD CONSTRAINT "_EmployeeToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToEmployee" ADD CONSTRAINT "_BuildingToEmployee_A_fkey" FOREIGN KEY ("A") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToEmployee" ADD CONSTRAINT "_BuildingToEmployee_B_fkey" FOREIGN KEY ("B") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
