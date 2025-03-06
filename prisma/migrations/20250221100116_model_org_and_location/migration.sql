/*
  Warnings:

  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `locationCategory` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `User` table. All the data in the column will be lost.
  - Added the required column `category` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrgLevel" AS ENUM ('DIVISION', 'DEPARTMENT', 'SECTION');

-- CreateEnum
CREATE TYPE "LocationCategory" AS ENUM ('CAAZ', 'CER', 'CNR', 'CWR', 'EAAZ', 'EER', 'ER', 'HEAD_QUARTER', 'NAAZ', 'NEER', 'NER', 'NNWR', 'NR', 'NWR', 'SAAZ', 'SER', 'SR', 'SSWR', 'SWAAZ', 'SWR', 'SWWR', 'WAAZ', 'WWR', 'WR');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "category" "LocationCategory" NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
DROP COLUMN "division",
DROP COLUMN "location",
DROP COLUMN "locationCategory",
DROP COLUMN "section",
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "supervisorId" TEXT;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "OrgLevel" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Organization_name_level_idx" ON "Organization"("name", "level");

-- CreateIndex
CREATE INDEX "Ability_action_subject_roleId_idx" ON "Ability"("action", "subject", "roleId");

-- CreateIndex
CREATE INDEX "Attendance_userId_locationId_checkIn_idx" ON "Attendance"("userId", "locationId", "checkIn");

-- CreateIndex
CREATE INDEX "Location_name_category_organizationId_idx" ON "Location"("name", "category", "organizationId");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "User_employeeId_email_organizationId_idx" ON "User"("employeeId", "email", "organizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
