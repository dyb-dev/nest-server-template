/*
  Warnings:

  - A unique constraint covering the columns `[name,deleted_at]` on the table `sys_role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sys_role_name_deleted_at_idx";

-- CreateIndex
CREATE UNIQUE INDEX "sys_role_name_deleted_at_key" ON "sys_role"("name", "deleted_at");
