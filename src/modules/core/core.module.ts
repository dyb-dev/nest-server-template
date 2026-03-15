/*
 * @FileDesc: 核心模块
 */

import { HttpModule } from "@nestjs/axios"
import { BullModule } from "@nestjs/bullmq"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { seconds, ThrottlerModule } from "@nestjs/throttler"
import { ClsPluginTransactional } from "@nestjs-cls/transactional"
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import { ClsModule } from "nestjs-cls"

import { CacheModule } from "./cache"
import { DatabaseModule, DatabaseService } from "./database"
import { LoggerModule } from "./logger"

import type { DynamicModule } from "@nestjs/common"
import type { SQLFlavor } from "@nestjs-cls/transactional-adapter-prisma/dist/src/lib/savepoint-syntax"

const { VITE_DATABASE_URL, VITE_CACHE_URL } = import.meta.env

/**
 * 核心模块
 * - 其子模块均为全局模块
 */
export class CoreModule {

    static forRoot (): DynamicModule {

        return {
            module: CoreModule,
            imports: [
                LoggerModule.forRoot(),

                EventEmitterModule.forRoot({
                    // 全局模块
                    global: true
                }),
                HttpModule.register({
                    // 全局模块
                    global: true,
                    // 请求超时时间 (毫秒)
                    timeout: 10000
                }),
                ThrottlerModule.forRoot({
                    // 限流选项
                    throttlers: [
                        // 每秒 20 次请求
                        { name: "short", ttl: seconds(1), limit: 20 },
                        // 每分钟 600 次请求
                        { name: "long", ttl: seconds(60), limit: 600 }
                    ]
                }),

                DatabaseModule.forRoot(),
                ClsModule.forRoot({
                    // 全局模块
                    global: true,
                    // 事务插件
                    plugins: [
                        new ClsPluginTransactional({
                            // ORM 适配器
                            adapter: new TransactionalAdapterPrisma({
                                // 自定义 PrismaClient 注入令牌
                                prismaInjectionToken: DatabaseService,
                                // 数据库
                                sqlFlavor: VITE_DATABASE_URL.split("://")[0] as SQLFlavor
                            })
                        })
                    ]
                }),

                CacheModule.forRoot(),
                BullModule.forRoot({
                    // 连接选项
                    connection: {
                        // 连接 URL
                        url: VITE_CACHE_URL
                    },
                    // 队列 key 前缀
                    prefix: "queue",
                    // 默认任务选项
                    defaultJobOptions: {
                        // 失败重试 3 次
                        attempts: 3,
                        // 完成后立即删除
                        removeOnComplete: true
                    }
                })
            ]
        }

    }

}
