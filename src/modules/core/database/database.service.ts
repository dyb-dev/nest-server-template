/*
 * @FileDesc: 数据库服务
 */

import { Injectable } from "@nestjs/common"
import { PrismaPg } from "@prisma/adapter-pg"
import { InjectPinoLogger } from "nestjs-pino"
import { Pool } from "pg"

import pkg from "@/../package.json"
import { PrismaClient } from "@/prisma/client"
import { TransactionIsolationLevel } from "@/prisma/internal/prismaNamespace"

import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import type { PinoLogger } from "nestjs-pino"

/** 数据库服务 */
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    /** 日志记录器 */
    @InjectPinoLogger(DatabaseService.name)
    private readonly logger: PinoLogger

    public constructor () {

        super({
            // 驱动适配器
            adapter: new PrismaPg(
                // 连接池
                new Pool({
                    // 应用程序名称
                    application_name: pkg.name,
                    // 备用应用程序名称
                    fallback_application_name: pkg.name,
                    // 客户端编码
                    client_encoding: "UTF8",

                    // 连接 URL
                    connectionString: import.meta.env.VITE_DATABASE_URL,

                    // 最小连接数
                    min: 5,
                    // 最大连接数
                    max: 20,

                    // 获取连接的超时时间 (毫秒)
                    connectionTimeoutMillis: 10000,
                    // 空闲连接的最大存活时间 (毫秒)
                    idleTimeoutMillis: 60000,
                    // 连接的最大存活时间 (秒)
                    maxLifetimeSeconds: 3600,
                    // 单个连接最大使用次数
                    maxUses: 7500,

                    // SQL执行超时 (毫秒)
                    statement_timeout: 60000,
                    // 查询超时 (毫秒)
                    query_timeout: 60000,
                    // 事务空闲超时 (毫秒)
                    idle_in_transaction_session_timeout: 10000,
                    // 锁等待超时 (毫秒)
                    lock_timeout: 10000,

                    // 启用 TCP keep-alive
                    keepAlive: true,
                    // TCP keep-alive 初始延迟时间 (毫秒)
                    keepAliveInitialDelayMillis: 10000
                }),
                {
                    // 适配器销毁时自动释放连接池
                    disposeExternalPool: true,
                    // 连接池错误回调
                    onPoolError: error => this.logger.error(error, "Database pool error"),
                    // 单个连接错误回调
                    onConnectionError: error => this.logger.error(error, "Database connection error")
                }
            ),
            // 日志选项
            log: [
                { emit: "event", level: "query" },
                { emit: "event", level: "info" },
                { emit: "event", level: "warn" },
                { emit: "event", level: "error" }
            ],
            // 事务选项
            transactionOptions: {
                // 等待获取事务连接的最大时间 (毫秒)
                maxWait: 5000,
                // 事务执行的最大时间 (毫秒)
                timeout: 10000,
                // 事务隔离级别 (默认: ReadCommitted)
                isolationLevel: TransactionIsolationLevel.ReadCommitted
            }
        })

    }

    /** HOOKS: 模块初始化 */
    public async onModuleInit (): Promise<void> {

        try {

            this.logger.info("Database connecting...")

            await this.$connect()

            this.logger.info("Database connected")

        }
        catch (error) {

            this.logger.error("Database connection failed")
            throw error

        }

    }

    /** HOOKS: 模块销毁 */
    public async onModuleDestroy (): Promise<void> {

        try {

            this.logger.info("Database disconnecting...")

            await this.$disconnect()

            this.logger.info("Database disconnected")

        }
        catch (error) {

            this.logger.error(error, "Database disconnection failed")

        }

    }

}
