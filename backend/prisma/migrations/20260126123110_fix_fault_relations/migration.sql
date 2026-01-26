/*
  Warnings:

  - You are about to drop the column `assignedToId` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `reportedById` on the `Fault` table. All the data in the column will be lost.
  - Added the required column `reportedBy` to the `Fault` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fault" DROP CONSTRAINT "Fault_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Fault" DROP CONSTRAINT "Fault_reportedById_fkey";

-- AlterTable
ALTER TABLE "Fault" DROP COLUMN "assignedToId",
DROP COLUMN "reportedById",
ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "reportedBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
