/*
 * @FileDesc: CSRF 守卫
 */

import { Inject, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { InjectPinoLogger } from "nestjs-pino"

import { PUBLIC_KEY } from "@/decorators"
import { CsrfTokenException } from "@/exceptions"
import { CsrfService } from "@/modules"

import type { CanActivate, ExecutionContext } from "@nestjs/common"
import type { Request, Response } from "express"
import type { PinoLogger } from "nestjs-pino"

/** CSRF 守卫 */
@Injectable()
export class CsrfGuard implements CanActivate {

    /** 日志记录器 */
    @InjectPinoLogger(CsrfGuard.name)
    private readonly logger: PinoLogger

    /** 反射器 */
    @Inject(Reflector)
    private readonly reflector: Reflector

    /** CSRF 服务 */
    @Inject(CsrfService)
    private readonly csrfService: CsrfService

    public canActivate (context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()])

        // 是否允许公开访问
        if (isPublic) {

            return Promise.resolve(true)

        }

        this.logger.info("Verification started")

        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()
        const response = httpContext.getResponse<Response>()

        return new Promise<boolean>((resolve, reject) => {

            this.csrfService.verifyCsrfToken(request, response, error => {

                if (error) {

                    reject(new CsrfTokenException("CSRF令牌无效"))

                }
                else {

                    this.logger.info("Verification completed")
                    resolve(true)

                }

            })

        })

    }

}
