/*
 * @FileDesc: prisma 配置
 */

import { defineConfig } from "prisma/config"

import { VITE_ENV } from "./vite.config"

export default defineConfig({
    // Prisma Schema 文件
    schema: "prisma/schema.prisma",
    // 迁移配置
    migrations: {
        // 迁移文件的存储目录
        path: "prisma/migrations",
        // 初始化种子数据脚本
        seed: "tsx prisma/seed.ts"
    },
    // 数据源配置
    datasource: {
        // 数据库连接 URL
        url: VITE_ENV.VITE_DATABASE_URL
    }
})
