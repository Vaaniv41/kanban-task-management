/*
  Warnings:

  - You are about to drop the column `position` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Column" DROP COLUMN "position";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "position";
