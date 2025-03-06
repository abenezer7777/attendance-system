/*
  Warnings:

  - You are about to drop the column `supervisorId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supervisorId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_supervisorId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "supervisorId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "supervisorId";

-- CreateIndex
CREATE UNIQUE INDEX "Organization_supervisorId_key" ON "Organization"("supervisorId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
