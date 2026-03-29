/*
 * @FileDesc: 权限守卫
 */

import { Inject, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { InjectPinoLogger } from "nestjs-pino"

import { PERMISSION_KEY } from "@/decorators"
import { InsufficientPermissionsException } from "@/exceptions"
import { PermissionService } from "@/modules"

import type { CanActivate, ExecutionContext } from "@nestjs/common"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 权限守卫 */
@Injectable()
export class PermissionGuard implements CanActivate {

    /** 日志记录器 */
    @InjectPinoLogger(PermissionGuard.name)
    private readonly logger: PinoLogger

    /** 反射器 */
    @Inject(Reflector)
    private readonly reflector: Reflector

    /** 权限服务 */
    @Inject(PermissionService)
    private readonly permissionService: PermissionService

    public async canActivate (context: ExecutionContext): Promise<boolean> {

        const requiredPerms = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [context.getHandler(), context.getClass()])

        // 未声明权限装饰器，直接放行
        if (!requiredPerms) {

            return true

        }

        this.logger.info("Verification started")

        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()
        const userId = request.user?.id

        if (!userId) {

            throw new InsufficientPermissionsException("用户未登录，无法验证权限")

        }

        const userPerms = await this.permissionService.getPermsByUserId(userId)

        if (!userPerms.includes(requiredPerms)) {

            throw new InsufficientPermissionsException("权限不足，禁止访问")

        }

        this.logger.info("Verification completed")
        return true

    }

}
