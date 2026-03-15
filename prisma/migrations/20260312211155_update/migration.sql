/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `sys_job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invokeTarget]` on the table `sys_job` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sys_job_name_idx";

-- CreateIndex
CREATE UNIQUE INDEX "sys_job_name_key" ON "sys_job"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_job_invokeTarget_key" ON "sys_job"("invokeTarget");
