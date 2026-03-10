/*
 * @FileDesc: 缓存装饰器
 */

import { CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager"
import { applyDecorators, UseInterceptors } from "@nestjs/common"

/** 缓存装饰器 选项 */
export interface CacheOptions {
    /**
     * 缓存键
     *
     * @default '使用路由路径'
     */
    key?: Parameters<typeof CacheKey>[0]
    /**
     * 缓存过期时间（毫秒）
     * - 0: 永不过期
     *
     * @default '使用全局配置'
     */
    ttl?: Parameters<typeof CacheTTL>[0]
}

/**
 * 缓存装饰器
 * - 仅支持 GET 请求
 *
 * @param {CacheOptions} options 选项
 * @returns {ReturnType<typeof applyDecorators>} 可用于方法和类上的装饰器
 */
export const Cache = (options?: CacheOptions): ReturnType<typeof applyDecorators> => {

    const decorators: Parameters<typeof applyDecorators> = [UseInterceptors(CacheInterceptor)]
    options?.key && decorators.push(CacheKey(options.key))
    options?.ttl !== void 0 && decorators.push(CacheTTL(options.ttl))
    return applyDecorators(...decorators)

}
