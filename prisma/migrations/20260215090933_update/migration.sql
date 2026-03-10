/*
  Warnings:

  - You are about to drop the column `last_active_at` on the `sys_login_session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sys_login_session" DROP COLUMN "last_active_at";

-- AlterTable
ALTER TABLE "sys_user" ADD COLUMN     "password_updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "sys_login_session_user_id_idx" ON "sys_login_session"("user_id");
