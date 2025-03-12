/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");
