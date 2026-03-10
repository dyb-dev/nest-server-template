/*
 * @FileDesc: 缓存服务
 */

import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import type { Cache } from "@nestjs/cache-manager"
import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import type { PinoLogger } from "nestjs-pino"

/** 缓存服务 */
@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {

    /** 日志记录器 */
    @InjectPinoLogger(CacheService.name)
    private readonly logger: PinoLogger

    /** 缓存管理器 */
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache

    /** HOOKS: 模块初始化 */
    public async onModuleInit (): Promise<void> {

        try {

            this.logger.info("Cache connecting...")

            /** redis 客户端 */
            const redisClient = this.cacheManager.stores[0].store.client
            await redisClient.connect()

            this.logger.info("Cache connected")

            // 注册事件监听器
            this.registerEventListeners()

        }
        catch (error) {

            this.logger.error("Cache connection failed")
            throw error

        }

    }

    /** HOOKS: 模块销毁 */
    public async onModuleDestroy (): Promise<void> {

        try {

            this.logger.info("Cache disconnecting...")

            await this.cacheManager.disconnect()

            this.logger.info("Cache disconnected")

        }
        catch (error) {

            this.logger.error(error, "Cache disconnection failed")

        }

    }

    /** FUN: 注册事件监听器 */
    private registerEventListeners (): void {

        /** redis 客户端 */
        const redisClient = this.cacheManager.stores[0].store.client

        // 连接建立事件
        redisClient.on("connect", () => this.logger.info("Cache connecting..."))

        // 就绪事件
        redisClient.on("ready", () => this.logger.info("Cache connected"))

        // 重连事件
        redisClient.on("reconnecting", () => this.logger.warn("Cache reconnecting"))

        // 错误事件 - 自动尝试重连
        redisClient.on("error", (error: Error) => this.logger.error(error, "Cache error"))

    }

}
