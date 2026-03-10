/*
 * @FileDesc: prisma 配置
 */

import { defineConfig } from "prisma/config"

import { VITE_ENV } from "./vite.config"

export default defineConfig({
    // 指定 Prisma Schema 文件路径
    schema: "prisma/schema.prisma",
    // 数据库迁移配置
    migrations: {
        // 指定迁移文件的存储目录
        path: "prisma/migrations"
    },
    // 数据源配置
    datasource: {
        // 数据库连接 URL
        url: VITE_ENV.VITE_DATABASE_URL
    }
})
