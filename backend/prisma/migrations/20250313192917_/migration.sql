/*
  Warnings:

  - A unique constraint covering the columns `[userId,permissionId,expiresAt,isRevoked]` on the table `user_permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_permissions_userId_permissionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permissionId_expiresAt_isRevoked_key" ON "user_permissions"("userId", "permissionId", "expiresAt", "isRevoked");
