/*
 * @FileDesc: 日志中间件
 */

import { randomUUID } from "node:crypto"

import { Inject, Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"
import { getClientIp } from "request-ip"

import { LocationService, UserAgentService } from "@/modules"
import { getBaseUrl } from "@/utils"

import type { NestMiddleware } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 日志中间件 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    /** 日志记录器 */
    @InjectPinoLogger(LoggerMiddleware.name)
    private readonly logger: PinoLogger

    /** 位置服务 */
    @Inject(LocationService)
    private readonly locationService: LocationService

    /** UserAgent 服务 */
    @Inject(UserAgentService)
    private readonly userAgentService: UserAgentService

    public async use (request: Request, _: Response, next: NextFunction): Promise<void> {

        request.startTime = Date.now()
        request.requestId = randomUUID()
        request.requestPath = request.baseUrl
        request.requestParams = this.getSanitizedParams(request)
        request.clientIp = getClientIp(request)
        request.location = request.clientIp && await this.locationService.getLocationByIp(request.clientIp)
        const userAgent = request.headers["user-agent"]
        request.browser = userAgent && this.userAgentService.getBrowser(userAgent)
        request.os = userAgent && this.userAgentService.getOS(userAgent)

        const {
            method,
            headers: { referer },
            requestId,
            requestPath: path,
            requestParams: params,
            clientIp: ip,
            location,
            browser,
            os
        } = request

        this.logger.info(
            {
                requestId,
                method,
                path,
                params,
                ip,
                location,
                browser,
                os,
                referer: referer && getBaseUrl(referer)
            },
            "Request started"
        )

        next()

    }

    /**
     * 获取脱敏后的请求参数
     *
     * @param {Request} request 请求对象
     * @returns {Request['requestParams']} 脱敏后的请求参数
     */
    private getSanitizedParams (request: Request): Request["requestParams"] {

        /** 敏感字段集合 */
        const sensitiveFields = new Set(["password", "oldPassword", "newPassword"])
        /** 原始请求参数 */
        const raw: Request["requestParams"] = request.method === "POST" ? request.body : request.query
        /** 脱敏后的请求参数 */
        const result: Request["requestParams"] = {}

        for (const [key, value] of Object.entries(raw ?? {})) {

            result[key] = sensitiveFields.has(key) ? "******" : value

        }

        return result

    }

}
