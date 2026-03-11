/*
 * @FileDesc: 认证守卫
 */

import { Inject, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { InjectPinoLogger } from "nestjs-pino"

import { PUBLIC_KEY } from "@/decorators"
import { AccessTokenException } from "@/exceptions"
import { AuthService } from "@/modules"

import type { CanActivate, ExecutionContext } from "@nestjs/common"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 认证守卫 */
@Injectable()
export class AuthGuard implements CanActivate {

    /** 日志记录器 */
    @InjectPinoLogger(AuthGuard.name)
    private readonly logger: PinoLogger

    /** 反射器 */
    @Inject(Reflector)
    private readonly reflector: Reflector

    /** 认证服务 */
    @Inject(AuthService)
    private readonly authService: AuthService

    public async canActivate (context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()])

        // 是否允许公开访问
        if (isPublic) {

            return true

        }

        this.logger.info("Verification started")

        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()
        const accessToken = request.cookies[this.authService.ACCESS_TOKEN_COOKIE_NAME]

        if (!accessToken) {

            throw new AccessTokenException("未授权,请先登录")

        }

        const payload = await this.authService.verifyAccessToken(accessToken)

        if (!payload) {

            throw new AccessTokenException("访问令牌无效或已过期")

        }

        request.user = {
            id: payload.sub,
            username: payload.username
        }

        this.logger.info("Verification completed")
        return true

    }

}
