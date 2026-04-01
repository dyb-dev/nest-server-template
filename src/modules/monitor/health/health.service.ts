/*
 * @FileDesc: 健康检查服务
 */

import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { pickBy } from "es-toolkit"
import { InjectPinoLogger } from "nestjs-pino"

import { HealthCheckException } from "@/exceptions"

import { DatabaseService } from "../../core"

import { CheckResponseDto } from "./health.dto"

import type { HealthStatus } from "./health.dto"
import type { Cache } from "@nestjs/cache-manager"
import type { PinoLogger } from "nestjs-pino"

/** 健康检查服务 */
@Injectable()
export class HealthService {

    /** 日志记录器 */
    @InjectPinoLogger(HealthService.name)
    private readonly logger: PinoLogger

    /** 数据库服务 */
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService

    /** 缓存管理器 */
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache

    /**
     * 执行健康检查
     *
     * @returns {Promise<CheckResponseDto>} 健康检查结果
     * @throws {HealthCheckException} 任一指标不健康时抛出异常
     */
    public async check (): Promise<CheckResponseDto> {

        this.logger.info("[check] started")

        const [database, cache] = await Promise.all([this.checkDatabase(), this.checkCache()])

        const data = {
            database,
            cache
        }
        const downIndicators = Object.keys(pickBy(data, status => status === "down"))

        if (downIndicators.length > 0) {

            throw new HealthCheckException(`${downIndicators.join(" and ")} ${downIndicators.length > 1 ? "are" : "is"} down`)

        }

        this.logger.info("[check] completed")
        return data

    }

    /**
     * 检查数据库健康状态
     *
     * @returns {Promise<HealthStatus>} 数据库健康状态
     */
    private async checkDatabase (): Promise<HealthStatus> {

        try {

            await this.databaseService.$queryRaw`SELECT 1`
            return "up"

        }
        catch {

            return "down"

        }

    }

    /**
     * 检查缓存健康状态
     *
     * @returns {Promise<HealthStatus>} 缓存健康状态
     */
    private async checkCache (): Promise<HealthStatus> {

        try {

            const redisClient = this.cacheManager.stores[0].store.client
            await redisClient.ping()
            return "up"

        }
        catch {

            return "down"

        }

    }

}
