/*
  Warnings:

  - Made the column `request_id` on table `sys_operation_log` required. This step will fail if there are existing NULL values in that column.
  - Made the column `module` on table `sys_operation_log` required. This step will fail if there are existing NULL values in that column.
  - Made the column `method` on table `sys_operation_log` required. This step will fail if there are existing NULL values in that column.
  - Made the column `params` on table `sys_operation_log` required. This step will fail if there are existing NULL values in that column.
  - Made the column `result` on table `sys_operation_log` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sys_login_log" ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "browser" DROP NOT NULL,
ALTER COLUMN "os" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sys_login_session" ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "browser" DROP NOT NULL,
ALTER COLUMN "os" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sys_operation_log" ALTER COLUMN "request_id" SET NOT NULL,
ALTER COLUMN "module" SET NOT NULL,
ALTER COLUMN "method" SET NOT NULL,
ALTER COLUMN "params" SET NOT NULL,
ALTER COLUMN "result" SET NOT NULL,
ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "user_agent" DROP NOT NULL;
