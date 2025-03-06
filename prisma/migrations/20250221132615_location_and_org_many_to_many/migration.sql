/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Location` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_organizationId_fkey";

-- DropIndex
DROP INDEX "Location_name_category_organizationId_idx";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "organizationId";

-- CreateTable
CREATE TABLE "_OrgLocation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrgLocation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrgLocation_B_index" ON "_OrgLocation"("B");

-- CreateIndex
CREATE INDEX "Location_name_category_idx" ON "Location"("name", "category");

-- AddForeignKey
ALTER TABLE "_OrgLocation" ADD CONSTRAINT "_OrgLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrgLocation" ADD CONSTRAINT "_OrgLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
