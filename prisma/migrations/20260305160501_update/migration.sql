/*
  Warnings:

  - You are about to drop the column `http_method` on the `sys_operation_log` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `sys_operation_log` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `sys_operation_log` table. All the data in the column will be lost.
  - You are about to alter the column `method` on the `sys_operation_log` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(10)`.

*/
-- DropIndex
DROP INDEX "sys_operation_log_module_idx";

-- AlterTable
ALTER TABLE "sys_operation_log" DROP COLUMN "http_method",
DROP COLUMN "module",
DROP COLUMN "user_agent",
ADD COLUMN     "browser" VARCHAR(100),
ADD COLUMN     "os" VARCHAR(100),
ALTER COLUMN "method" SET DATA TYPE VARCHAR(10);
