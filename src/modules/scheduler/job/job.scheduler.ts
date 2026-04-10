/*
 * @FileDesc: 定时任务调度器
 */

import { Inject, Injectable } from "@nestjs/common"
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core"
import { CronJob, validateCronExpression } from "cron"

import { JOB_KEY } from "@/decorators"

import { JobLogService } from "../job-log"

import { JobRepository } from "./job.repository"

import type { SysJob } from "@/prisma/client"
import type { OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common"

/** 定时任务调度器 */
@Injectable()
export class JobScheduler implements OnApplicationBootstrap, OnApplicationShutdown {

    /** 发现服务 */
    @Inject(DiscoveryService)
    private readonly discoveryService: DiscoveryService

    /** 元数据扫描器 */
    @Inject(MetadataScanner)
    private readonly metadataScanner: MetadataScanner

    /** 反射器 */
    @Inject(Reflector)
    private readonly reflector: Reflector

    /** 定时任务仓储 */
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository

    /** 定时任务日志服务 */
    @Inject(JobLogService)
    private readonly jobLogService: JobLogService

    /**
     * 任务处理器映射表
     * - invokeTarget key → handler 函数
     */
    private readonly handlerMap = new Map<string, () => void | Promise<void>>()

    /**
     * cron 实例映射表
     * - 任务ID → CronJob 实例
     */
    private readonly cronJobMap = new Map<number, CronJob>()

    /** HOOKS: 应用启动完成 */
    public async onApplicationBootstrap (): Promise<void> {

        this.scanHandlers()
        await this.initCronJobs()

    }

    /** HOOKS: 应用关闭时 */
    public async onApplicationShutdown (): Promise<void> {

        await Promise.all(Array.from(this.cronJobMap.values()).map(cronJob => cronJob.stop()))
        this.cronJobMap.clear()

    }

    /**
     * 获取已注册 handler key 的集合
     *
     * @returns {string[]} 已注册 handler key 的集合
     */
    public getHandlerKeys (): string[] {

        return Array.from(this.handlerMap.keys())

    }

    /**
     * 检查 handler 是否已注册
     *
     * @param {string} invokeTarget 调用目标 key
     * @returns {boolean} 是否已注册
     */
    public hasHandler (invokeTarget: string): boolean {

        return this.handlerMap.has(invokeTarget)

    }

    /**
     * 创建 cron 实例
     *
     * @param {SysJob} job 任务信息
     * @throws {Error} handler 未注册或 cron 表达式非法时抛出
     */
    public createCronJob (job: SysJob): void {

        const cronJob = this.cronJobMap.get(job.id)
        if (cronJob) {

            throw new Error("定时任务已存在")

        }

        const validation = validateCronExpression(job.cronExpression)
        if (!validation.valid) {

            throw new Error("Cron 表达式格式不正确")

        }

        const handler = this.handlerMap.get(job.invokeTarget)
        if (!handler) {

            throw new Error("调用目标未注册")

        }

        this.cronJobMap.set(
            job.id,
            CronJob.from({
                // 任务名称
                name: job.name,
                // cron 表达式
                cronTime: job.cronExpression,
                // 是否在创建后立即启动
                start: job.isActive,
                // 当前 tick 未完成时，跳过下一次调度
                waitForCompletion: true,
                // 任务执行函数
                onTick: async () => {

                    const executedAt = new Date()

                    try {

                        await handler()
                        this.jobLogService.create({
                            jobId: job.id,
                            name: job.name,
                            invokeTarget: job.invokeTarget,
                            isSystem: job.isSystem,
                            isSuccess: true,
                            message: "执行成功",
                            executedAt
                        })

                    }
                    catch (error) {

                        this.jobLogService.create({
                            jobId: job.id,
                            name: job.name,
                            invokeTarget: job.invokeTarget,
                            isSystem: job.isSystem,
                            isSuccess: false,
                            message: (error as Error).message || "执行失败",
                            exceptionInfo: (error as Error).stack,
                            executedAt
                        })

                    }

                }
            })
        )

    }

    /**
     * 更新 cron 实例
     *
     * @param {SysJob} job 更新后的任务信息
     * @throws {Error} handler 未注册或 cron 表达式非法时抛出
     */
    public async updateCronJob (job: SysJob): Promise<void> {

        await this.deleteCronJob(job.id)
        this.createCronJob(job)

    }

    /**
     * 删除 cron 实例
     *
     * @param {number} id 任务ID
     * @throws {Error} cron 实例不存在时抛出
     */
    public async deleteCronJob (id: number): Promise<void> {

        const cronJob = this.cronJobMap.get(id)
        if (!cronJob) {

            throw new Error("定时任务不存在")

        }

        await cronJob.stop()
        this.cronJobMap.delete(id)

    }

    /**
     * 执行 cron 任务
     *
     * @param {number} id 任务ID
     * @throws {Error} cron 实例不存在或任务正在执行时抛出
     */
    public runCronJob (id: number): void {

        const cronJob = this.cronJobMap.get(id)
        if (!cronJob) {

            throw new Error("定时任务不存在")

        }

        if (cronJob.isCallbackRunning) {

            throw new Error("定时任务正在执行中")

        }

        cronJob.fireOnTick()

    }

    /**
     * 检查 cron 实例是否正在执行中
     *
     * @param {number} id 任务ID
     * @returns {boolean} 是否正在执行中
     */
    public isCronJobRunning (id: number): boolean {

        const cronJob = this.cronJobMap.get(id)
        if (!cronJob) {

            throw new Error("定时任务不存在")

        }

        return cronJob.isCallbackRunning

    }

    /** 扫描 Job 装饰器的所有绑定方法 */
    private scanHandlers (): void {

        const providers = this.discoveryService.getProviders()

        for (const wrapper of providers) {

            const { instance } = wrapper

            if (!instance || typeof instance !== "object") {

                continue

            }

            const prototype = Object.getPrototypeOf(instance)
            const methodNames = this.metadataScanner.getAllMethodNames(prototype)

            for (const methodName of methodNames) {

                const key = this.reflector.get<string>(JOB_KEY, prototype[methodName])
                if (!key) {

                    continue

                }

                this.handlerMap.set(key, instance[methodName].bind(instance))

            }

        }

    }

    /** 初始化所有 cron 实例 */
    private async initCronJobs (): Promise<void> {

        const jobs = await this.jobRepository.findMany()

        for (const job of jobs) {

            this.createCronJob(job)

        }

    }

}
