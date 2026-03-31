/*
 * @FileDesc: 服务器监控控制器
 */

import { Controller, Get, Inject } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { Permission } from "@/decorators"

import { GetInfoResponseDto } from "./server.dto"
import { ServerService } from "./server.service"

import type { PinoLogger } from "nestjs-pino"

/** 服务器监控控制器 */
@Controller("server")
export class ServerController {

    /** 日志记录器 */
    @InjectPinoLogger(ServerController.name)
    private readonly logger: PinoLogger

    /** 服务器监控服务 */
    @Inject(ServerService)
    private readonly serverService: ServerService

    /**
     * 获取服务器信息
     *
     * @returns {Promise<GetInfoResponseDto>} 服务器信息
     */
    @Permission("system:server:read")
    @Get("getInfo")
    public async getInfo (): Promise<GetInfoResponseDto> {

        this.logger.info("[getInfo] started")
        const data = await this.serverService.getInfo()
        this.logger.info("[getInfo] completed")
        return data

    }

}
