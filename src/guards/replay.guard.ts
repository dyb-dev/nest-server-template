/*
 * @FileDesc: 防重放守卫
 */

import { Inject, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { InjectPinoLogger } from "nestjs-pino"

import { REPLAY_KEY } from "@/decorators"
import { ReplayRequestException } from "@/exceptions"
import { ReplayService } from "@/modules"

import type { CanActivate, ExecutionContext } from "@nestjs/common"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 防重放守卫 */
@Injectable()
export class ReplayGuard implements CanActivate {

    /** 日志记录器 */
    @InjectPinoLogger(ReplayGuard.name)
    private readonly logger: PinoLogger

    /** 反射器 */
    @Inject(Reflector)
    private readonly reflector: Reflector

    /** 防重放服务 */
    @Inject(ReplayService)
    private readonly replayService: ReplayService

    public async canActivate (context: ExecutionContext): Promise<boolean> {

        const isReplay = this.reflector.getAllAndOverride<boolean>(REPLAY_KEY, [context.getHandler(), context.getClass()])

        // 是否启用防重放验证
        if (!isReplay) {

            return true

        }

        this.logger.info("Verification started")

        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()

        const timestamp = request.headers["x-timestamp"] as string
        const nonce = request.headers["x-nonce"] as string

        if (!timestamp || !nonce) {

            throw new ReplayRequestException("缺少防重放请求头")

        }

        if (!this.replayService.verifyTimestamp(timestamp)) {

            throw new ReplayRequestException("请求时间戳已过期")

        }

        const isNonceValid = await this.replayService.verifyNonce(nonce)

        if (!isNonceValid) {

            throw new ReplayRequestException("重放请求已拒绝")

        }

        this.logger.info("Verification completed")
        return true

    }

}
