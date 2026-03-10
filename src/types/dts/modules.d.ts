/*
 * @FileDesc: 模块类型声明
 */

declare module "request-ip" {
    import type { Request } from "express"

    /**
     * 获取客户端 IP 地址
     *
     * @param {Request} request Express Request 对象
     * @returns {string | null} 客户端 IP 地址
     */
    export const getClientIp: (request: Request) => string | null
}
