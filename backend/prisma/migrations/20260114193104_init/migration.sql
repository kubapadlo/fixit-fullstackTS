-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'technician', 'admin');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Elektryk', 'Hydraulik', 'Murarz', 'Malarz', 'Stolarz', 'Slusarz');

-- CreateEnum
CREATE TYPE "FaultState" AS ENUM ('reported', 'assigned', 'fixed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'student',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dorm" TEXT,
    "room" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fault" (
    "id" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "Category" NOT NULL,
    "description" TEXT NOT NULL,
    "state" "FaultState" NOT NULL DEFAULT 'reported',
    "review" TEXT DEFAULT '',
    "imageURL" TEXT DEFAULT '',
    "imageID" TEXT DEFAULT '',
    "reportedById" TEXT NOT NULL,
    "assignedToId" TEXT,

    CONSTRAINT "Fault_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
