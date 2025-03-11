/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `permission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE permission_id_seq;
ALTER TABLE "permission" ALTER COLUMN "id" SET DEFAULT nextval('permission_id_seq');
ALTER SEQUENCE permission_id_seq OWNED BY "permission"."id";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permission_slug_key" ON "permission"("slug");
