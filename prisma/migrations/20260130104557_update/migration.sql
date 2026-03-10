-- DropIndex
DROP INDEX "sys_job_log_executed_at_idx";

-- DropIndex
DROP INDEX "sys_job_log_job_id_executed_at_idx";

-- DropIndex
DROP INDEX "sys_login_log_login_at_idx";

-- DropIndex
DROP INDEX "sys_login_log_user_id_login_at_idx";

-- DropIndex
DROP INDEX "sys_login_session_user_id_last_active_at_idx";

-- DropIndex
DROP INDEX "sys_notice_created_at_idx";

-- DropIndex
DROP INDEX "sys_notice_is_active_type_created_at_idx";

-- DropIndex
DROP INDEX "sys_operation_log_operated_at_idx";

-- DropIndex
DROP INDEX "sys_operation_log_user_id_operated_at_idx";

-- CreateIndex
CREATE INDEX "sys_config_name_idx" ON "sys_config"("name");

-- CreateIndex
CREATE INDEX "sys_config_is_system_idx" ON "sys_config"("is_system");

-- CreateIndex
CREATE INDEX "sys_config_created_at_idx" ON "sys_config"("created_at");

-- CreateIndex
CREATE INDEX "sys_dept_name_deleted_at_idx" ON "sys_dept"("name", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_dept_is_active_deleted_at_idx" ON "sys_dept"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_dict_item_label_idx" ON "sys_dict_item"("label");

-- CreateIndex
CREATE INDEX "sys_dict_item_is_active_idx" ON "sys_dict_item"("is_active");

-- CreateIndex
CREATE INDEX "sys_dict_type_is_active_idx" ON "sys_dict_type"("is_active");

-- CreateIndex
CREATE INDEX "sys_dict_type_created_at_idx" ON "sys_dict_type"("created_at");

-- CreateIndex
CREATE INDEX "sys_job_name_idx" ON "sys_job"("name");

-- CreateIndex
CREATE INDEX "sys_job_is_system_idx" ON "sys_job"("is_system");

-- CreateIndex
CREATE INDEX "sys_job_is_active_idx" ON "sys_job"("is_active");

-- CreateIndex
CREATE INDEX "sys_job_log_name_idx" ON "sys_job_log"("name");

-- CreateIndex
CREATE INDEX "sys_job_log_is_system_idx" ON "sys_job_log"("is_system");

-- CreateIndex
CREATE INDEX "sys_job_log_is_success_idx" ON "sys_job_log"("is_success");

-- CreateIndex
CREATE INDEX "sys_job_log_executed_at_idx" ON "sys_job_log"("executed_at");

-- CreateIndex
CREATE INDEX "sys_login_log_username_idx" ON "sys_login_log"("username");

-- CreateIndex
CREATE INDEX "sys_login_log_ip_idx" ON "sys_login_log"("ip");

-- CreateIndex
CREATE INDEX "sys_login_log_is_success_idx" ON "sys_login_log"("is_success");

-- CreateIndex
CREATE INDEX "sys_login_log_login_at_idx" ON "sys_login_log"("login_at");

-- CreateIndex
CREATE INDEX "sys_login_session_username_idx" ON "sys_login_session"("username");

-- CreateIndex
CREATE INDEX "sys_login_session_ip_idx" ON "sys_login_session"("ip");

-- CreateIndex
CREATE INDEX "sys_menu_name_idx" ON "sys_menu"("name");

-- CreateIndex
CREATE INDEX "sys_menu_is_active_idx" ON "sys_menu"("is_active");

-- CreateIndex
CREATE INDEX "sys_notice_title_idx" ON "sys_notice"("title");

-- CreateIndex
CREATE INDEX "sys_notice_type_idx" ON "sys_notice"("type");

-- CreateIndex
CREATE INDEX "sys_notice_is_active_idx" ON "sys_notice"("is_active");

-- CreateIndex
CREATE INDEX "sys_notice_created_at_idx" ON "sys_notice"("created_at");

-- CreateIndex
CREATE INDEX "sys_operation_log_username_idx" ON "sys_operation_log"("username");

-- CreateIndex
CREATE INDEX "sys_operation_log_module_idx" ON "sys_operation_log"("module");

-- CreateIndex
CREATE INDEX "sys_operation_log_ip_idx" ON "sys_operation_log"("ip");

-- CreateIndex
CREATE INDEX "sys_operation_log_is_success_idx" ON "sys_operation_log"("is_success");

-- CreateIndex
CREATE INDEX "sys_operation_log_operated_at_idx" ON "sys_operation_log"("operated_at");

-- CreateIndex
CREATE INDEX "sys_post_is_active_idx" ON "sys_post"("is_active");

-- CreateIndex
CREATE INDEX "sys_role_name_deleted_at_idx" ON "sys_role"("name", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_role_is_active_deleted_at_idx" ON "sys_role"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_role_created_at_deleted_at_idx" ON "sys_role"("created_at", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_user_is_active_deleted_at_idx" ON "sys_user"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_user_created_at_deleted_at_idx" ON "sys_user"("created_at", "deleted_at");
