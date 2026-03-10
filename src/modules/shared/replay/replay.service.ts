/*
 * @FileDesc: 防重放服务
 */

import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"

import type { Cache } from "@nestjs/cache-manager"

/** 防重放服务 */
@Injectable()
export class ReplayService {

    /** 缓存管理器 */
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache

    /** 时间窗口（毫秒） */
    private readonly WINDOW_MS = 60 * 1000

    /**
     * 验证时间戳是否在有效窗口内
     *
     * @param {string} timestamp 时间戳字符串
     * @returns {boolean} 是否有效
     */
    public verifyTimestamp (timestamp: string): boolean {

        const requestTime = Number(timestamp)
        if (isNaN(requestTime)) {

            return false

        }
        return Math.abs(Date.now() - requestTime) <= this.WINDOW_MS

    }

    /**
     * 验证 nonce 是否已使用，未使用则存入缓存
     *
     * @param {string} nonce 随机字符串
     * @returns {Promise<boolean>} 是否有效（未被使用）
     */
    public async verifyNonce (nonce: string): Promise<boolean> {

        const cacheKey = this.getCacheKey(nonce)
        const existing = await this.cacheManager.get<string>(cacheKey)
        if (existing) {

            return false

        }
        await this.cacheManager.set(cacheKey, "1", this.WINDOW_MS)
        return true

    }

    /**
     * 获取缓存 Key
     *
     * @param {string} nonce 随机字符串
     * @returns {string} 缓存 Key
     */
    private getCacheKey (nonce: string): string {

        return `replay:${nonce}`

    }

}
