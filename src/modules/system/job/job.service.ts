/*
 * @FileDesc: 定时任务服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"

import {
    CreateRequestDto,
    UpdateRequestDto,
    UpdateStatusRequestDto,
    GetListRequestDto,
    GetPageListRequestDto,
    GetDetailRequestDto,
    DeleteRequestDto,
    BatchDeleteRequestDto,
    RunRequestDto
} from "./job.dto"
import { JobRepository } from "./job.repository"
import { JobScheduler } from "./job.scheduler"

import type { SysJob, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { Request } from "express"
import type { PinoLogger } from "nestjs-pino"

/** 定时任务服务 */
@Injectable()
export class JobService {

    /** 日志记录器 */
    @InjectPinoLogger(JobService.name)
    private readonly logger: PinoLogger

    /** 定时任务仓储 */
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository

    /** 定时任务调度器 */
    @Inject(JobScheduler)
    private readonly jobScheduler: JobScheduler

    /**
     * 获取定时任务列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysJob[]>} 定时任务列表
     */
    public async getList (params: GetListRequestDto): Promise<SysJob[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.jobRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页定时任务列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysJob>>} 定时任务列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysJob>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.jobRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 获取定时任务详情
     *
     * @param {GetDetailRequestDto} params 查询参数
     * @returns {Promise<SysJob>} 定时任务详情
     */
    public async getDetail (params: GetDetailRequestDto): Promise<SysJob> {

        this.logger.info("[getDetail] started")

        const data = await this.checkJobExists(params.id)

        this.logger.info("[getDetail] completed")
        return data

    }

    /**
     * 创建定时任务
     *
     * @param {CreateRequestDto} params 创建参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async create (params: CreateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[create] started")

        await this.checkNameNotExists(params.name)
        await this.checkInvokeTargetNotExists(params.invokeTarget)
        this.checkHandlerRegistered(params.invokeTarget)

        const job = await this.jobRepository.create({
            ...params,
            createdBy: user?.username
        })

        this.jobScheduler.createCronJob(job)

        this.logger.info("[create] completed")

    }

    /**
     * 更新定时任务
     *
     * @param {UpdateRequestDto} params 更新参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async update (params: UpdateRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[update] started")

        const existingJob = await this.checkJobExists(params.id)

        if (params.name !== existingJob.name) {

            await this.checkNameNotExists(params.name)

        }

        if (params.invokeTarget !== existingJob.invokeTarget) {

            await this.checkInvokeTargetNotExists(params.invokeTarget)
            this.checkHandlerRegistered(params.invokeTarget)

        }

        const { id, ...updateData } = params

        const updatedJob = await this.jobRepository.updateById(id, {
            ...updateData,
            updatedBy: user?.username
        })

        await this.jobScheduler.updateCronJob(updatedJob)

        this.logger.info("[update] completed")

    }

    /**
     * 更新定时任务状态
     *
     * @param {UpdateStatusRequestDto} params 更新参数
     * @param {Request["user"]} user 当前用户
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async updateStatus (params: UpdateStatusRequestDto, user: Request["user"]): Promise<void> {

        this.logger.info("[updateStatus] started")

        await this.checkJobExists(params.id)

        const updatedJob = await this.jobRepository.updateById(params.id, {
            isActive: params.isActive,
            updatedBy: user?.username
        })

        await this.jobScheduler.updateCronJob(updatedJob)

        this.logger.info("[updateStatus] completed")

    }

    /**
     * 删除定时任务
     *
     * @param {DeleteRequestDto} params 删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        const job = await this.checkJobExists(params.id)

        if (job.isSystem) {

            throw new BusinessLogicException("系统内置任务不允许删除")

        }

        await this.jobRepository.deleteById(params.id)
        await this.jobScheduler.deleteCronJob(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 批量删除定时任务
     *
     * @param {BatchDeleteRequestDto} params 批量删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async batchDelete (params: BatchDeleteRequestDto): Promise<void> {

        this.logger.info("[batchDelete] started")

        const jobs = await this.jobRepository.findMany({
            where: { id: { in: params.ids } }
        })

        if (jobs.length !== params.ids.length) {

            throw new BusinessLogicException("部分定时任务不存在")

        }

        const hasSystemJob = jobs.some(job => job.isSystem)
        if (hasSystemJob) {

            throw new BusinessLogicException("不能删除系统任务")

        }

        await this.jobRepository.deleteMany({
            where: { id: { in: params.ids } }
        })

        await Promise.all(params.ids.map(id => this.jobScheduler.deleteCronJob(id)))

        this.logger.info("[batchDelete] completed")

    }

    /**
     * 执行定时任务
     *
     * @param {RunRequestDto} params 执行参数
     * @returns {Promise<void>}
     */
    public async run (params: RunRequestDto): Promise<void> {

        this.logger.info("[run] started")

        await this.checkJobExists(params.id)

        if (this.jobScheduler.isCronJobRunning(params.id)) {

            throw new BusinessLogicException("定时任务正在执行中")

        }

        this.jobScheduler.runCronJob(params.id)

        this.logger.info("[run] completed")

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysJobWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysJobWhereInput {

        const { name, isSystem, isActive } = params

        return {
            ...name && { name: { contains: name } },
            ...isSystem !== void 0 && { isSystem },
            ...isActive !== void 0 && { isActive }
        }

    }

    /**
     * 检查定时任务是否存在
     *
     * @param {number} id 任务ID
     * @returns {Promise<SysJob>} 任务信息
     * @throws {BusinessLogicException} 任务不存在时抛出异常
     */
    private async checkJobExists (id: number): Promise<SysJob> {

        const job = await this.jobRepository.findById(id)
        if (!job) {

            throw new BusinessLogicException("定时任务不存在")

        }
        return job

    }

    /**
     * 检查名称是否不存在
     *
     * @param {string} name 名称
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 名称已存在时抛出异常
     */
    private async checkNameNotExists (name: string): Promise<void> {

        const exists = await this.jobRepository.exists({ name })
        if (exists) {

            throw new BusinessLogicException("定时任务名称已存在")

        }

    }

    /**
     * 检查调用目标是否不存在
     *
     * @param {string} invokeTarget 调用目标
     * @returns {Promise<void>}
     * @throws {BusinessLogicException} 调用目标已存在时抛出异常
     */
    private async checkInvokeTargetNotExists (invokeTarget: string): Promise<void> {

        const exists = await this.jobRepository.exists({ invokeTarget })
        if (exists) {

            throw new BusinessLogicException("调用目标已存在")

        }

    }

    /**
     * 检查 handler 是否已注册
     *
     * @param {string} invokeTarget 调用目标 key
     * @throws {BusinessLogicException} handler 未注册时抛出异常
     */
    private checkHandlerRegistered (invokeTarget: string): void {

        if (!this.jobScheduler.hasHandler(invokeTarget)) {

            throw new BusinessLogicException("调用目标未注册")

        }

    }

}
