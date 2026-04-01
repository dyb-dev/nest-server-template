/*
 * @FileDesc: 健康检查控制器
 */

import { Controller, Get, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Public } from "@/decorators"

import { CheckResponseDto } from "./health.dto"
import { HealthService } from "./health.service"

import type { PinoLogger } from "nestjs-pino"

/** 健康检查控制器 */
@Controller("health")
export class HealthController {

    /** 日志记录器 */
    @InjectPinoLogger(HealthController.name)
    private readonly logger: PinoLogger

    /** 健康检查服务 */
    @Inject(HealthService)
    private readonly healthService: HealthService

    /**
     * 健康检查
     *
     * @returns {Promise<CheckResponseDto>} 健康检查结果
     */
    @Public()
    @Get("check")
    public async check (): Promise<CheckResponseDto> {

        this.logger.info("[check] started")
        const result = await this.healthService.check()
        this.logger.info("[check] completed")
        return result

    }

}
