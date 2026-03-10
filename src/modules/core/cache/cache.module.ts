/*
 * @FileDesc: 缓存模块
 */

import KeyvRedis from "@keyv/redis"
import { CacheModule as CacheManagerModule } from "@nestjs/cache-manager"

import { CacheService } from "./cache.service"

import type { DynamicModule } from "@nestjs/common"

/** 缓存模块 */
export class CacheModule {

    static forRoot (): DynamicModule {

        return {
            module: CacheModule,
            global: true,
            imports: [
                CacheManagerModule.register({
                    stores: [
                        // redis 适配器
                        new KeyvRedis(
                            {
                                // 连接 URL
                                url: import.meta.env.VITE_CACHE_URL,
                                // 连接断开时，待发送命令队列最大长度
                                commandsQueueMaxLength: 2000
                            },
                            {
                                // 使用异步删除键，避免阻塞主线程
                                useUnlink: true,
                                // 连接失败时抛出异常
                                throwOnConnectError: true,
                                // 操作失败时抛出异常
                                throwOnErrors: true,
                                // 连接超时时间 (毫秒)
                                connectionTimeout: 5000
                            }
                        )
                    ],
                    // 缓存过期时间 (毫秒)
                    ttl: 60000,
                    // 刷新缓存阈值 (毫秒)
                    refreshThreshold: 10000
                })
            ],
            providers: [CacheService],
            exports: [CacheManagerModule]
        }

    }

}
