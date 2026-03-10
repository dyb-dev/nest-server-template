/*
 * @FileDesc: Demo 服务
 */

import { Inject, Injectable, Scope } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import { GetDemoListRequestDto } from "./demo.dto"
import { MODULE_OPTIONS_TOKEN } from "./demo.module-definition"

import type { DemoModuleOptions } from "./demo.module-definition"
import type {
    OnModuleInit,
    OnApplicationShutdown,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown
} from "@nestjs/common"
import type { PinoLogger } from "nestjs-pino"

/** Demo 服务 */
@Injectable({
    scope: Scope.DEFAULT
})
export class DemoService
implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {

    /** 日志记录器 */
    @InjectPinoLogger(DemoService.name)
    private readonly logger: PinoLogger

    /** 模块配置 */
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly moduleConfig: DemoModuleOptions

    /** HOOKS: 模块初始化 */
    public onModuleInit (): void {

        this.logger.info(this.moduleConfig, "onModuleInit")

    }

    /** HOOKS: 应用启动完成 */
    public onApplicationBootstrap (): void {

        this.logger.info("onApplicationBootstrap")

    }

    /** HOOKS: 模块销毁 */
    public onModuleDestroy (): void {

        this.logger.info("onModuleDestroy")

    }

    /** HOOKS: 应用关闭前 */
    public beforeApplicationShutdown (): void {

        this.logger.info("beforeApplicationShutdown")

    }

    /** HOOKS: 应用关闭时 */
    public onApplicationShutdown (): void {

        this.logger.info("onApplicationShutdown")

    }

    /**
     * 获取演示列表
     *
     * @param requestDto 请求DTO
     *
     * @returns {Promise<string[]>} 演示列表
     */
    public async getDemoList (requestDto: GetDemoListRequestDto): Promise<string[]> {

        this.logger.info("[getDemoList] started")
        const data = await Promise.resolve(requestDto.demoList)
        this.logger.info("[getDemoList] completed")
        return data

    }

}
