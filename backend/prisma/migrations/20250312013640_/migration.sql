-- AlterTable
ALTER TABLE "users" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "birthday" DROP NOT NULL;
