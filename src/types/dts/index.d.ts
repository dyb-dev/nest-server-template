/*
 * @FileDesc: 全局类型声明
 */

import type { SysUser } from "@/prisma/client"

declare global {
    declare namespace Express {
        interface Request {
            /**
             * 请求 id
             * - 类型: UUID
             */
            requestId: string
            /** 请求路径 */
            requestPath: string
            /**
             * 请求参数
             * - GET: query 对象
             * - POST: body 对象
             */
            requestParams: Record<string, any>
            /**
             * 开始时间
             * - 类型: 时间戳
             */
            startTime: number
            /** 客户端 IP */
            clientIp?: string | null
            /** 地理位置 */
            location?: string | null
            /** 浏览器 */
            browser?: string | null
            /** 操作系统 */
            os?: string | null
            /** 用户信息 */
            user?: Pick<SysUser, "id" | "username">
        }
    }
}
