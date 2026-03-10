-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('Male', 'Female', 'Unknown');

-- CreateEnum
CREATE TYPE "SysRoleDataScope" AS ENUM ('All', 'Custom', 'Dept', 'DeptAndBelow');

-- CreateEnum
CREATE TYPE "SysMenuType" AS ENUM ('Catalog', 'Menu', 'Button');

-- CreateEnum
CREATE TYPE "SysNoticeType" AS ENUM ('Notification', 'Announcement');

-- CreateTable
CREATE TABLE "sys_config" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_dict_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_dict_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_dict_item" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "css_class" VARCHAR(100),
    "list_class" VARCHAR(100),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_dict_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_job" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "invokeTarget" VARCHAR(100) NOT NULL,
    "cron_expression" VARCHAR(100) NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_job_log" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "invokeTarget" VARCHAR(100) NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_success" BOOLEAN NOT NULL,
    "message" VARCHAR(255),
    "exception_info" TEXT,
    "executed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_job_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "nickname" VARCHAR(30),
    "password" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50),
    "phone" VARCHAR(20),
    "avatar" VARCHAR(100),
    "gender" "UserGender" NOT NULL DEFAULT 'Unknown',
    "dept_id" INTEGER,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" BIGINT NOT NULL DEFAULT 0,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_dept" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "ancestors" VARCHAR(50) NOT NULL DEFAULT '',
    "name" VARCHAR(30) NOT NULL,
    "leader_id" INTEGER,
    "email" VARCHAR(50),
    "phone" VARCHAR(20),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" BIGINT NOT NULL DEFAULT 0,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_dept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_post" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_user_post" (
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "sys_user_post_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "sys_role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "data_scope" "SysRoleDataScope" NOT NULL DEFAULT 'All',
    "is_menu_check_strict" BOOLEAN NOT NULL DEFAULT false,
    "is_dept_check_strict" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" BIGINT NOT NULL DEFAULT 0,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_user_role" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "sys_user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "sys_role_dept" (
    "role_id" INTEGER NOT NULL,
    "dept_id" INTEGER NOT NULL,

    CONSTRAINT "sys_role_dept_pkey" PRIMARY KEY ("role_id","dept_id")
);

-- CreateTable
CREATE TABLE "sys_menu" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "route_name" VARCHAR(50),
    "path" VARCHAR(200),
    "component" VARCHAR(255),
    "perms" VARCHAR(100),
    "icon" VARCHAR(100),
    "type" "SysMenuType" NOT NULL,
    "is_external" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "is_cache" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_role_menu" (
    "role_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "sys_role_menu_pkey" PRIMARY KEY ("role_id","menu_id")
);

-- CreateTable
CREATE TABLE "sys_login_session" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "dept_name" VARCHAR(30),
    "refresh_token" TEXT NOT NULL,
    "ip" VARCHAR(45) NOT NULL,
    "location" VARCHAR(255),
    "browser" VARCHAR(100) NOT NULL,
    "os" VARCHAR(100) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "login_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_login_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_login_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "username" VARCHAR(30) NOT NULL,
    "ip" VARCHAR(45) NOT NULL,
    "location" VARCHAR(255),
    "browser" VARCHAR(100) NOT NULL,
    "os" VARCHAR(100) NOT NULL,
    "is_success" BOOLEAN NOT NULL,
    "message" VARCHAR(255),
    "login_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_login_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_operation_log" (
    "id" SERIAL NOT NULL,
    "request_id" VARCHAR(64),
    "user_id" INTEGER,
    "username" VARCHAR(30),
    "module" VARCHAR(50),
    "method" VARCHAR(50),
    "http_method" VARCHAR(10) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "params" JSONB,
    "result" JSONB,
    "ip" VARCHAR(45) NOT NULL,
    "location" VARCHAR(255),
    "user_agent" TEXT NOT NULL,
    "is_success" BOOLEAN NOT NULL,
    "message" VARCHAR(255),
    "operated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "sys_operation_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_notice" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "type" "SysNoticeType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "remark" VARCHAR(500),

    CONSTRAINT "sys_notice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_config_key_key" ON "sys_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "sys_dict_type_name_key" ON "sys_dict_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_dict_type_code_key" ON "sys_dict_type"("code");

-- CreateIndex
CREATE INDEX "sys_dict_item_type_id_sort_idx" ON "sys_dict_item"("type_id", "sort");

-- CreateIndex
CREATE UNIQUE INDEX "sys_dict_item_type_id_label_key" ON "sys_dict_item"("type_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "sys_dict_item_type_id_value_key" ON "sys_dict_item"("type_id", "value");

-- CreateIndex
CREATE INDEX "sys_job_log_job_id_executed_at_idx" ON "sys_job_log"("job_id", "executed_at" DESC);

-- CreateIndex
CREATE INDEX "sys_job_log_executed_at_idx" ON "sys_job_log"("executed_at" DESC);

-- CreateIndex
CREATE INDEX "sys_user_dept_id_idx" ON "sys_user"("dept_id");

-- CreateIndex
CREATE INDEX "sys_user_deleted_at_idx" ON "sys_user"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sys_user_username_deleted_at_key" ON "sys_user"("username", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sys_user_email_deleted_at_key" ON "sys_user"("email", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sys_user_phone_deleted_at_key" ON "sys_user"("phone", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_dept_deleted_at_idx" ON "sys_dept"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sys_dept_parent_id_name_deleted_at_key" ON "sys_dept"("parent_id", "name", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sys_post_name_key" ON "sys_post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_post_code_key" ON "sys_post"("code");

-- CreateIndex
CREATE INDEX "sys_user_post_post_id_idx" ON "sys_user_post"("post_id");

-- CreateIndex
CREATE INDEX "sys_role_deleted_at_idx" ON "sys_role"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sys_role_code_deleted_at_key" ON "sys_role"("code", "deleted_at");

-- CreateIndex
CREATE INDEX "sys_user_role_role_id_idx" ON "sys_user_role"("role_id");

-- CreateIndex
CREATE INDEX "sys_role_dept_dept_id_idx" ON "sys_role_dept"("dept_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_menu_route_name_key" ON "sys_menu"("route_name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_menu_path_key" ON "sys_menu"("path");

-- CreateIndex
CREATE UNIQUE INDEX "sys_menu_perms_key" ON "sys_menu"("perms");

-- CreateIndex
CREATE INDEX "sys_menu_parent_id_sort_idx" ON "sys_menu"("parent_id", "sort");

-- CreateIndex
CREATE INDEX "sys_role_menu_menu_id_idx" ON "sys_role_menu"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_login_session_refresh_token_key" ON "sys_login_session"("refresh_token");

-- CreateIndex
CREATE INDEX "sys_login_session_user_id_last_active_at_idx" ON "sys_login_session"("user_id", "last_active_at" DESC);

-- CreateIndex
CREATE INDEX "sys_login_session_expires_at_idx" ON "sys_login_session"("expires_at");

-- CreateIndex
CREATE INDEX "sys_login_log_user_id_login_at_idx" ON "sys_login_log"("user_id", "login_at" DESC);

-- CreateIndex
CREATE INDEX "sys_login_log_login_at_idx" ON "sys_login_log"("login_at" DESC);

-- CreateIndex
CREATE INDEX "sys_operation_log_request_id_idx" ON "sys_operation_log"("request_id");

-- CreateIndex
CREATE INDEX "sys_operation_log_user_id_operated_at_idx" ON "sys_operation_log"("user_id", "operated_at" DESC);

-- CreateIndex
CREATE INDEX "sys_operation_log_operated_at_idx" ON "sys_operation_log"("operated_at" DESC);

-- CreateIndex
CREATE INDEX "sys_notice_is_active_type_created_at_idx" ON "sys_notice"("is_active", "type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "sys_notice_created_at_idx" ON "sys_notice"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "sys_dict_item" ADD CONSTRAINT "sys_dict_item_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "sys_dict_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_job_log" ADD CONSTRAINT "sys_job_log_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "sys_job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user" ADD CONSTRAINT "sys_user_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "sys_dept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_dept" ADD CONSTRAINT "sys_dept_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "sys_dept"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_dept" ADD CONSTRAINT "sys_dept_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "sys_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_post" ADD CONSTRAINT "sys_user_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_post" ADD CONSTRAINT "sys_user_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "sys_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_role" ADD CONSTRAINT "sys_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_role" ADD CONSTRAINT "sys_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_dept" ADD CONSTRAINT "sys_role_dept_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_dept" ADD CONSTRAINT "sys_role_dept_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "sys_dept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_menu" ADD CONSTRAINT "sys_menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "sys_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_menu" ADD CONSTRAINT "sys_role_menu_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_menu" ADD CONSTRAINT "sys_role_menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "sys_menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_login_session" ADD CONSTRAINT "sys_login_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_login_log" ADD CONSTRAINT "sys_login_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_operation_log" ADD CONSTRAINT "sys_operation_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
