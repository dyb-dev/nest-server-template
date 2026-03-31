/*
 * @FileDesc: 缓存监控服务
 */

import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { InjectPinoLogger } from "nestjs-pino"

import {
    DeleteByKeyRequestDto,
    DeleteByNameRequestDto,
    GetInfoResponseDto,
    GetKeyListRequestDto,
    GetValueRequestDto
} from "./cache.dto"

import type { Cache } from "@nestjs/cache-manager"
import type { PinoLogger } from "nestjs-pino"

/** 缓存监控服务 */
@Injectable()
export class CacheService {

    /** 日志记录器 */
    @InjectPinoLogger(CacheService.name)
    private readonly logger: PinoLogger

    /** 缓存管理器 */
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache

    private get redisClient () {

        return this.cacheManager.stores[0].store.client

    }

    /**
     * 获取缓存信息
     *
     * @returns {Promise<GetInfoResponseDto>} 缓存信息
     */
    public async getInfo (): Promise<GetInfoResponseDto> {

        this.logger.info("[getInfo] started")

        const raw = await this.redisClient.info()
        const result = this.parseInfo(raw)

        this.logger.info("[getInfo] completed")
        return result

    }

    /**
     * 获取缓存名称列表
     *
     * @returns {Promise<string[]>} 缓存名称列表
     */
    public async getNameList (): Promise<string[]> {

        this.logger.info("[getNameList] started")

        const keys = await this.scanKeys()
        const nameList = Array.from(new Set(keys.map(key => key.split(":")[0])))

        this.logger.info("[getNameList] completed")
        return nameList

    }

    /**
     * 获取缓存键名列表
     *
     * @param {GetKeyListRequestDto} params 请求参数
     * @returns {Promise<string[]>} 缓存键名列表
     */
    public async getKeyList (params: GetKeyListRequestDto): Promise<string[]> {

        this.logger.info("[getKeyList] started")
        const keyList = await this.scanKeys(`${params.name}:*`)
        this.logger.info("[getKeyList] completed")
        return keyList

    }

    /**
     * 获取缓存键值
     *
     * @param {GetValueRequestDto} params 请求参数
     * @returns {Promise<unknown>} 缓存值
     */
    public async getValue (params: GetValueRequestDto): Promise<unknown> {

        this.logger.info("[getValue] started")
        const value = await this.cacheManager.get(params.key)
        this.logger.info("[getValue] completed")
        return value

    }

    /**
     * 删除缓存名称（删除该前缀下所有键）
     *
     * @param {DeleteByNameRequestDto} params 请求参数
     * @returns {Promise<void>}
     */
    public async deleteByName (params: DeleteByNameRequestDto): Promise<void> {

        this.logger.info("[deleteByName] started")

        const keys = await this.scanKeys(`${params.name}:*`)

        if (keys.length > 0) {

            await this.redisClient.del(keys)

        }

        this.logger.info("[deleteByName] completed")

    }

    /**
     * 删除缓存键
     *
     * @param {DeleteByKeyRequestDto} params 请求参数
     * @returns {Promise<void>}
     */
    public async deleteByKey (params: DeleteByKeyRequestDto): Promise<void> {

        this.logger.info("[deleteByKey] started")
        await this.cacheManager.del(params.key)
        this.logger.info("[deleteByKey] completed")

    }

    /**
     * 清空所有缓存
     *
     * @returns {Promise<void>}
     */
    public async deleteAll (): Promise<void> {

        this.logger.info("[deleteAll] started")
        await this.cacheManager.clear()
        this.logger.info("[deleteAll] completed")

    }

    /**
     * 解析 Redis INFO 原始字符串
     *
     * @param {string} raw Redis INFO 原始字符串
     * @returns {GetInfoResponseDto} 缓存信息
     */
    private parseInfo (raw: string): GetInfoResponseDto {

        const map: Record<string, string> = {}

        for (const line of raw.split("\n")) {

            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith("#")) {

                continue

            }
            const colonIndex = trimmed.indexOf(":")
            if (colonIndex === -1) {

                continue

            }
            map[trimmed.slice(0, colonIndex).trim()] = trimmed.slice(colonIndex + 1).trim()

        }

        const usedMemory = parseInt(map["used_memory"] ?? "0")
        const totalSystemMemory = parseInt(map["total_system_memory"] ?? "0")

        const keyspaceHits = parseInt(map["keyspace_hits"] ?? "0")
        const keyspaceMisses = parseInt(map["keyspace_misses"] ?? "0")
        const total = keyspaceHits + keyspaceMisses

        return {
            version: map["redis_version"] ?? "",
            uptimeInSeconds: parseInt(map["uptime_in_seconds"] ?? "0"),
            uptimeInDays: parseInt(map["uptime_in_days"] ?? "0"),
            connectedClients: parseInt(map["connected_clients"] ?? "0"),
            usedMemory,
            usedMemoryPeak: parseInt(map["used_memory_peak"] ?? "0"),
            totalSystemMemory,
            usedMemoryRate: totalSystemMemory > 0 ? parseFloat((usedMemory / totalSystemMemory * 100).toFixed(2)) : 0,
            memFragmentationRatio: parseFloat(map["mem_fragmentation_ratio"] ?? "0"),
            totalCommandsProcessed: parseInt(map["total_commands_processed"] ?? "0"),
            totalConnectionsReceived: parseInt(map["total_connections_received"] ?? "0"),
            expiredKeys: parseInt(map["expired_keys"] ?? "0"),
            keyspaceHits,
            keyspaceMisses,
            hitRate: total > 0 ? parseFloat((keyspaceHits / total * 100).toFixed(2)) : 0,
            totalKeys: parseInt(map["db0"]?.match(/keys=(\d+)/)?.[1] ?? "0")
        }

    }

    /**
     * 扫描缓存键名列表
     *
     * @param {string} [match="*"] 匹配模式
     * @returns {Promise<string[]>} 键名列表
     */
    private async scanKeys (match: string = "*"): Promise<string[]> {

        const keys: string[] = []

        for await (const keyBatch of this.redisClient.scanIterator({ MATCH: match })) {

            keys.push(...keyBatch)

        }

        return keys

    }

}
